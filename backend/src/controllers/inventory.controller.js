import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Inventory } from "../models/inventory.model.js";
import { Product } from "../models/product.model.js";

const getAllInventory = asynchandler(async (req, res) => {
    const { stockStatus, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (stockStatus) {
        const inventories = await Inventory.find().populate('product', 'name category unit price');
        const filtered = inventories.filter(inv => {
            const status = inv.stockStatus;
            return status === stockStatus;
        });
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginated = filtered.slice(skip, skip + parseInt(limit));

        return res.status(200).json(
            new ApiResponse(200, {
                inventory: paginated,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: filtered.length,
                    pages: Math.ceil(filtered.length / parseInt(limit))
                }
            }, "Inventory fetched successfully")
        );
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const inventory = await Inventory.find(filter)
        .populate('product', 'name category unit price')
        .sort({ availableQuantity: 1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Inventory.countDocuments(filter);

    res.status(200).json(
        new ApiResponse(200, {
            inventory,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }, "Inventory fetched successfully")
    );
});

const getInventoryByProductId = asynchandler(async (req, res) => {
    const { productId } = req.params;

    const inventory = await Inventory.findOne({ product: productId })
        .populate('product', 'name category unit price');

    if (!inventory) {
        throw new ApiError(404, "Inventory not found for this product");
    }

    res.status(200).json(
        new ApiResponse(200, inventory, "Inventory fetched successfully")
    );
});

const updateInventory = asynchandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity, minStockLevel, maxStockLevel } = req.body;

    const inventory = await Inventory.findOne({ product: productId });
    if (!inventory) {
        throw new ApiError(404, "Inventory not found for this product");
    }

    if (quantity !== undefined) {
        inventory.quantity = quantity;
        inventory.lastRestocked = new Date();
    }
    if (minStockLevel !== undefined) inventory.minStockLevel = minStockLevel;
    if (maxStockLevel !== undefined) inventory.maxStockLevel = maxStockLevel;

    await inventory.save();

    // Update product stock
    const product = await Product.findById(productId);
    if (product) {
        product.stock = inventory.quantity;
        await product.save();
    }

    const populatedInventory = await Inventory.findById(inventory._id)
        .populate('product', 'name category unit price');

    res.status(200).json(
        new ApiResponse(200, populatedInventory, "Inventory updated successfully")
    );
});

const restockInventory = asynchandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        throw new ApiError(400, "Valid quantity is required");
    }

    const inventory = await Inventory.findOne({ product: productId });
    if (!inventory) {
        throw new ApiError(404, "Inventory not found for this product");
    }

    inventory.quantity += quantity;
    inventory.lastRestocked = new Date();
    await inventory.save();

    // Update product stock
    const product = await Product.findById(productId);
    if (product) {
        product.stock = inventory.quantity;
        await product.save();
    }

    const populatedInventory = await Inventory.findById(inventory._id)
        .populate('product', 'name category unit price');

    res.status(200).json(
        new ApiResponse(200, populatedInventory, "Inventory restocked successfully")
    );
});

const getLowStockItems = asynchandler(async (req, res) => {
    const inventories = await Inventory.find()
        .populate('product', 'name category unit price')
        .sort({ availableQuantity: 1 });

    const lowStockItems = inventories.filter(inv => {
        return inv.availableQuantity <= inv.minStockLevel;
    });

    res.status(200).json(
        new ApiResponse(200, lowStockItems, "Low stock items fetched successfully")
    );
});

export { getAllInventory, getInventoryByProductId, updateInventory, restockInventory, getLowStockItems };

