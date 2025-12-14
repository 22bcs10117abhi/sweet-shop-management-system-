import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { Inventory } from "../models/inventory.model.js";

const createProduct = asynchandler(async (req, res) => {
    const { name, description, category, price, costPrice, unit, stock, minStockLevel, barcode } = req.body;

    if (!name || !category || price === undefined || costPrice === undefined || !unit) {
        throw new ApiError(400, "Name, category, price, costPrice, and unit are required");
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        throw new ApiError(404, "Category not found");
    }

    // Check if barcode already exists
    if (barcode) {
        const existingProduct = await Product.findOne({ barcode });
        if (existingProduct) {
            throw new ApiError(400, "Product with this barcode already exists");
        }
    }

    const product = await Product.create({
        name,
        description: description || "",
        category,
        price,
        costPrice,
        unit,
        stock: stock || 0,
        minStockLevel: minStockLevel || 10,
        barcode: barcode || undefined
    });

    // Create inventory entry
    await Inventory.create({
        product: product._id,
        quantity: product.stock,
        minStockLevel: product.minStockLevel,
        lastRestocked: new Date()
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name');

    res.status(201).json(
        new ApiResponse(201, populatedProduct, "Product created successfully")
    );
});

const getAllProducts = asynchandler(async (req, res) => {
    const { category, isActive, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json(
        new ApiResponse(200, {
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }, "Products fetched successfully")
    );
});

const getProductById = asynchandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id).populate('category', 'name description');
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully")
    );
});

const updateProduct = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, category, price, costPrice, unit, stock, minStockLevel, isActive, barcode } = req.body;

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            throw new ApiError(404, "Category not found");
        }
        product.category = category;
    }

    if (barcode && barcode !== product.barcode) {
        const existingProduct = await Product.findOne({ barcode });
        if (existingProduct) {
            throw new ApiError(400, "Product with this barcode already exists");
        }
        product.barcode = barcode;
    }

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (costPrice !== undefined) product.costPrice = costPrice;
    if (unit) product.unit = unit;
    if (stock !== undefined) product.stock = stock;
    if (minStockLevel !== undefined) product.minStockLevel = minStockLevel;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    // Update inventory
    const inventory = await Inventory.findOne({ product: id });
    if (inventory) {
        inventory.quantity = product.stock;
        inventory.minStockLevel = product.minStockLevel;
        await inventory.save();
    }

    const populatedProduct = await Product.findById(id).populate('category', 'name');

    res.status(200).json(
        new ApiResponse(200, populatedProduct, "Product updated successfully")
    );
});

const deleteProduct = asynchandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    await Product.findByIdAndDelete(id);
    await Inventory.findOneAndDelete({ product: id });

    res.status(200).json(
        new ApiResponse(200, null, "Product deleted successfully")
    );
});

const getLowStockProducts = asynchandler(async (req, res) => {
    const products = await Product.find({
        isActive: true,
        $expr: { $lte: ['$stock', '$minStockLevel'] }
    }).populate('category', 'name').sort({ stock: 1 });

    res.status(200).json(
        new ApiResponse(200, products, "Low stock products fetched successfully")
    );
});

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getLowStockProducts };

