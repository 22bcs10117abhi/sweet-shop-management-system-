import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Customer } from "../models/customer.model.js";

const createCustomer = asynchandler(async (req, res) => {
    const { name, email, phone, address } = req.body;

    if (!name || !phone) {
        throw new ApiError(400, "Name and phone are required");
    }

    // Check if customer with same phone exists
    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
        throw new ApiError(400, "Customer with this phone number already exists");
    }

    const customer = await Customer.create({
        name,
        email: email || "",
        phone,
        address: address || {}
    });

    res.status(201).json(
        new ApiResponse(201, customer, "Customer created successfully")
    );
});

const getAllCustomers = asynchandler(async (req, res) => {
    const { isActive, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const customers = await Customer.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Customer.countDocuments(filter);

    res.status(200).json(
        new ApiResponse(200, {
            customers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }, "Customers fetched successfully")
    );
});

const getCustomerById = asynchandler(async (req, res) => {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    res.status(200).json(
        new ApiResponse(200, customer, "Customer fetched successfully")
    );
});

const updateCustomer = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, isActive } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    if (phone && phone !== customer.phone) {
        const existingCustomer = await Customer.findOne({ phone });
        if (existingCustomer) {
            throw new ApiError(400, "Customer with this phone number already exists");
        }
        customer.phone = phone;
    }

    if (name) customer.name = name;
    if (email !== undefined) customer.email = email;
    if (address) customer.address = { ...customer.address, ...address };
    if (isActive !== undefined) customer.isActive = isActive;

    await customer.save();

    res.status(200).json(
        new ApiResponse(200, customer, "Customer updated successfully")
    );
});

const deleteCustomer = asynchandler(async (req, res) => {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    await Customer.findByIdAndDelete(id);

    res.status(200).json(
        new ApiResponse(200, null, "Customer deleted successfully")
    );
});

// Public customer registration (no auth required)
const registerCustomer = asynchandler(async (req, res) => {
    const { name, email, phone, address } = req.body;

    if (!name || !phone) {
        throw new ApiError(400, "Name and phone are required");
    }

    // Check if customer with same phone exists
    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
        throw new ApiError(400, "Customer with this phone number already exists");
    }

    // Check if customer with same email exists (if email provided)
    if (email) {
        const existingEmailCustomer = await Customer.findOne({ email });
        if (existingEmailCustomer) {
            throw new ApiError(400, "Customer with this email already exists");
        }
    }

    const customer = await Customer.create({
        name,
        email: email || "",
        phone,
        address: address || {}
    });

    res.status(201).json(
        new ApiResponse(201, customer, "Customer registered successfully")
    );
});

export { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer, registerCustomer };

