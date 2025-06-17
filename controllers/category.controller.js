const {
    addCategory,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
    getAllCategories
} = require('../services/categoryService');

const {
    successResponse,
    errorResponse,
    notFoundResponse
} = require('../utils/apiResponses');

const { categoryValidation } = require('../validations/categoryValidation');

// Add Category
exports.addCategory = async (req, res) => {
    const { error } = categoryValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }

    try {
        const { name, brand_id } = req.body;
        await addCategory(name, brand_id);
        return successResponse(res, {}, "Category added successfully.");
    } catch (err) {
        if (err.message === 'Duplicate category is not allowed') {
            return notFoundResponse(res, err.message);
        }
        return errorResponse(res, err.message);
    }
};

// Get Single Category
exports.getCategory = async (req, res) => {
    try {
        const category = await getCategoryById(req.params.id);
        return successResponse(res, category, "Category fetched successfully.");
    } catch (err) {
        return notFoundResponse(res, err.message);
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    const { error } = categoryValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }

    try {
        const { name, brand_id } = req.body;
        await updateCategoryById(req.params.id, name, brand_id);
        return successResponse(res, {}, "Category updated successfully.");
    } catch (err) {
        if (err.message.startsWith('Category not found') || err.message === "Duplicate category is not allowed") {
            return notFoundResponse(res, err.message);
        }
        return errorResponse(res, err.message);
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        await deleteCategoryById(req.params.id);
        return successResponse(res, {}, "Category deleted successfully.");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// List All Categories
exports.getCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await getAllCategories(page, limit);
        return successResponse(res, result, "Categories fetched successfully.");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};