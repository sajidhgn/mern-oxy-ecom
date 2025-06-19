const {
    addBrands,
    getBrandById,
    updateBrandById,
    deleteBrandById,
    getAllBrands
} = require('../services/brandService');

const {
    successResponse,
    errorResponse,
    notFoundResponse
} = require('../utils/apiResponses');

// Add Brands
exports.addBrand = async (req, res) => {
    try {
        const result = await addBrands(req.body.brands);
        return successResponse(res, result, "Brands added successfully.");
    } catch (err) {
        if (err.message === "Brands list must be a non-empty array." ||
            err.message === "All brands already exist.") {
            return notFoundResponse(res, err.message);
        }
        return errorResponse(res, err.message);
    }
};

// Get Single Brand
exports.getBrand = async (req, res) => {
    try {
        const brand = await getBrandById(req.params.id);
        return successResponse(res, brand, "Brand fetched successfully.");
    } catch (err) {
        return notFoundResponse(res, err.message);
    }
};

// Update Brand
exports.updateBrand = async (req, res) => {
    try {
        const updated = await updateBrandById(req.params.id, req.body);
        return successResponse(res, updated, "Brand updated successfully.");
    } catch (err) {
        if (err.message.startsWith('Brand not found')) {
            return notFoundResponse(res, err.message);
        }
        return errorResponse(res, err.message);
    }
};

// Delete Brand
exports.deleteBrand = async (req, res) => {
    try {
        const result = await deleteBrandById(req.params.id);
        return successResponse(res, {}, result);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// List All Brands
exports.getBrands = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await getAllBrands(page, limit);
        return successResponse(res, result, "Brands fetched successfully.");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};