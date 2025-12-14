import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/category.model.js";

const createCategory = asynchandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Category name is required");
    }

    const existingCategory = await Category.findOne({ name: name.toLowerCase() });
    if (existingCategory) {
        throw new ApiError(400, "Category with this name already exists");
    }

    const category = await Category.create({
        name: name.toLowerCase(),
        description: description || ""
    });

    res.status(201).json(
        new ApiResponse(201, category, "Category created successfully")
    );
});

const getAllCategories = asynchandler(async (req, res) => {
    const { isActive } = req.query;
    const filter = {};
    
    if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, categories, "Categories fetched successfully")
    );
});

const getCategoryById = asynchandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    res.status(200).json(
        new ApiResponse(200, category, "Category fetched successfully")
    );
});

const updateCategory = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    if (name && name.toLowerCase() !== category.name) {
        const existingCategory = await Category.findOne({ name: name.toLowerCase() });
        if (existingCategory) {
            throw new ApiError(400, "Category with this name already exists");
        }
        category.name = name.toLowerCase();
    }

    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json(
        new ApiResponse(200, category, "Category updated successfully")
    );
});

const deleteCategory = asynchandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json(
        new ApiResponse(200, null, "Category deleted successfully")
    );
});

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };

