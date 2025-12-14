import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { Customer } from "../models/customer.model.js";
import { Product } from "../models/product.model.js";
import { Inventory } from "../models/inventory.model.js";

const createOrder = asynchandler(async (req, res) => {
    const { customer, items, discount = 0, tax = 0, paymentMethod, paymentStatus, notes } = req.body;

    if (!customer || !items || items.length === 0) {
        throw new ApiError(400, "Customer and items are required");
    }

    // Verify customer exists
    const customerExists = await Customer.findById(customer);
    if (!customerExists) {
        throw new ApiError(404, "Customer not found");
    }

    // Process items and calculate totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new ApiError(404, `Product with ID ${item.product} not found`);
        }

        if (!product.isActive) {
            throw new ApiError(400, `Product ${product.name} is not active`);
        }

        // Check inventory
        const inventory = await Inventory.findOne({ product: item.product });
        if (!inventory || inventory.availableQuantity < item.quantity) {
            throw new ApiError(400, `Insufficient stock for ${product.name}`);
        }

        const itemSubtotal = item.quantity * product.price;
        subtotal += itemSubtotal;

        processedItems.push({
            product: item.product,
            productName: product.name,
            quantity: item.quantity,
            unit: product.unit,
            price: product.price,
            subtotal: itemSubtotal
        });
    }

    const total = subtotal - discount + tax;

    // Generate order number
    const count = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, '0')}`;

    // Create order
    const order = await Order.create({
        orderNumber,
        customer,
        items: processedItems,
        subtotal,
        discount,
        tax,
        total,
        paymentMethod: paymentMethod || 'cash',
        paymentStatus: paymentStatus || 'pending',
        orderStatus: 'pending',
        notes: notes || ""
    });

    // Update inventory
    for (const item of processedItems) {
        const inventory = await Inventory.findOne({ product: item.product });
        if (inventory) {
            inventory.quantity -= item.quantity;
            inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - item.quantity);
            inventory.lastSold = new Date();
            await inventory.save();
        }

        // Update product stock
        const product = await Product.findById(item.product);
        if (product) {
            product.stock -= item.quantity;
            await product.save();
        }
    }

    // Update customer stats
    customerExists.totalOrders += 1;
    customerExists.totalSpent += total;
    await customerExists.save();

    const populatedOrder = await Order.findById(order._id)
        .populate('customer', 'name phone email')
        .populate('items.product', 'name unit');

    res.status(201).json(
        new ApiResponse(201, populatedOrder, "Order created successfully")
    );
});

const getAllOrders = asynchandler(async (req, res) => {
    const { customer, orderStatus, paymentStatus, startDate, endDate, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (customer) filter.customer = customer;
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
        .populate('customer', 'name phone email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.status(200).json(
        new ApiResponse(200, {
            orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }, "Orders fetched successfully")
    );
});

const getOrderById = asynchandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id)
        .populate('customer', 'name phone email address')
        .populate('items.product', 'name description unit image');

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    res.status(200).json(
        new ApiResponse(200, order, "Order fetched successfully")
    );
});

const updateOrder = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { orderStatus, paymentStatus, notes } = req.body;

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (orderStatus) {
        if (!['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].includes(orderStatus)) {
            throw new ApiError(400, "Invalid order status");
        }
        order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
        if (!['pending', 'paid', 'partial', 'refunded'].includes(paymentStatus)) {
            throw new ApiError(400, "Invalid payment status");
        }
        order.paymentStatus = paymentStatus;
    }

    if (notes !== undefined) order.notes = notes;

    await order.save();

    const populatedOrder = await Order.findById(id)
        .populate('customer', 'name phone email')
        .populate('items.product', 'name unit');

    res.status(200).json(
        new ApiResponse(200, populatedOrder, "Order updated successfully")
    );
});

// Approve order (change status from pending to confirmed)
const approveOrder = asynchandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.orderStatus !== 'pending') {
        throw new ApiError(400, `Cannot approve order with status: ${order.orderStatus}`);
    }

    order.orderStatus = 'confirmed';
    await order.save();

    const populatedOrder = await Order.findById(id)
        .populate('customer', 'name phone email')
        .populate('items.product', 'name unit');

    res.status(200).json(
        new ApiResponse(200, populatedOrder, "Order approved successfully")
    );
});

// Reject order (change status to cancelled)
const rejectOrder = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.orderStatus === 'completed') {
        throw new ApiError(400, "Cannot reject a completed order");
    }

    // Restore inventory if order was confirmed or preparing
    if (order.orderStatus === 'confirmed' || order.orderStatus === 'preparing') {
        for (const item of order.items) {
            const inventory = await Inventory.findOne({ product: item.product });
            if (inventory) {
                inventory.quantity += item.quantity;
                await inventory.save();
            }

            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }
    }

    order.orderStatus = 'cancelled';
    if (reason) {
        order.notes = (order.notes || '') + ` [Rejected: ${reason}]`;
    }
    await order.save();

    const populatedOrder = await Order.findById(id)
        .populate('customer', 'name phone email')
        .populate('items.product', 'name unit');

    res.status(200).json(
        new ApiResponse(200, populatedOrder, "Order rejected successfully")
    );
});

const cancelOrder = asynchandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.orderStatus === 'cancelled') {
        throw new ApiError(400, "Order is already cancelled");
    }

    if (order.orderStatus === 'completed') {
        throw new ApiError(400, "Cannot cancel a completed order");
    }

    // Restore inventory
    for (const item of order.items) {
        const inventory = await Inventory.findOne({ product: item.product });
        if (inventory) {
            inventory.quantity += item.quantity;
            await inventory.save();
        }

        const product = await Product.findById(item.product);
        if (product) {
            product.stock += item.quantity;
            await product.save();
        }
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json(
        new ApiResponse(200, order, "Order cancelled successfully")
    );
});

// Get customer orders by phone (no auth required)
const getCustomerOrders = asynchandler(async (req, res) => {
    const { phone } = req.query;

    if (!phone) {
        throw new ApiError(400, "Phone number is required");
    }

    // Find customer by phone
    const customer = await Customer.findOne({ phone });
    if (!customer) {
        return res.status(200).json(
            new ApiResponse(200, { orders: [] }, "No orders found for this customer")
        );
    }

    const orders = await Order.find({ customer: customer._id })
        .populate('customer', 'name phone email')
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, { orders }, "Customer orders fetched successfully")
    );
});

const getOrderStats = asynchandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const totalOrders = await Order.countDocuments(filter);
    const totalRevenue = await Order.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const ordersByStatus = await Order.aggregate([
        { $match: filter },
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.status(200).json(
        new ApiResponse(200, {
            totalOrders,
            totalRevenue: revenue,
            ordersByStatus
        }, "Order statistics fetched successfully")
    );
});

// Customer order creation (no auth required, creates customer if needed)
const createCustomerOrder = asynchandler(async (req, res) => {
    const { customerName, customerPhone, customerEmail, items, discount = 0, tax = 0, paymentMethod, notes } = req.body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
        throw new ApiError(400, "Customer name, phone, and items are required");
    }

    // Find or create customer
    let customer = await Customer.findOne({ phone: customerPhone });
    
    if (!customer) {
        // Create new customer
        customer = await Customer.create({
            name: customerName,
            phone: customerPhone,
            email: customerEmail || ""
        });
    }

    // Process items and calculate totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new ApiError(404, `Product with ID ${item.product} not found`);
        }

        if (!product.isActive) {
            throw new ApiError(400, `Product ${product.name} is not active`);
        }

        // Check inventory
        const inventory = await Inventory.findOne({ product: item.product });
        if (!inventory || inventory.availableQuantity < item.quantity) {
            throw new ApiError(400, `Insufficient stock for ${product.name}`);
        }

        const itemSubtotal = item.quantity * product.price;
        subtotal += itemSubtotal;

        processedItems.push({
            product: item.product,
            productName: product.name,
            quantity: item.quantity,
            unit: product.unit,
            price: product.price,
            subtotal: itemSubtotal
        });
    }

    const total = subtotal - discount + tax;

    // Generate order number
    const count = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, '0')}`;

    // Create order
    const order = await Order.create({
        orderNumber,
        customer: customer._id,
        items: processedItems,
        subtotal,
        discount,
        tax,
        total,
        paymentMethod: paymentMethod || 'cash',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        notes: notes || ""
    });

    // Update inventory
    for (const item of processedItems) {
        const inventory = await Inventory.findOne({ product: item.product });
        if (inventory) {
            inventory.quantity -= item.quantity;
            inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - item.quantity);
            inventory.lastSold = new Date();
            await inventory.save();
        }

        // Update product stock
        const product = await Product.findById(item.product);
        if (product) {
            product.stock -= item.quantity;
            await product.save();
        }
    }

    // Update customer stats
    customer.totalOrders += 1;
    customer.totalSpent += total;
    await customer.save();

    const populatedOrder = await Order.findById(order._id)
        .populate('customer', 'name phone email')
        .populate('items.product', 'name unit');

    res.status(201).json(
        new ApiResponse(201, populatedOrder, "Order created successfully")
    );
});

export { createOrder, createCustomerOrder, getAllOrders, getOrderById, getCustomerOrders, updateOrder, approveOrder, rejectOrder, cancelOrder, getOrderStats };

