const {
    addProduct,
    getProductById,
    updateProductById,
    deleteProductById,
    getAllProducts
} = require('../services/productService');

const {
    successResponse,
    errorResponse,
    notFoundResponse
} = require('../utils/apiResponses');

const { productValidation } = require('../validations/productValidation');

// Add Product
exports.addProduct = async (req, res) => {
    const { error } = productValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }
    
    try {
        const result = await addProduct(req.body);
        return successResponse(res, result, "Product added successfully.");
    } catch (err) {
        if (err.message === 'Duplicate product is not allowed') {
            return notFoundResponse(res, err.message);
        }
        return errorResponse(res, err.message);
    }
};

// Get Single Product
exports.getProduct = async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        return successResponse(res, product, "Product fetched successfully.");
    } catch (err) {
        return notFoundResponse(res, err.message);
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    const { error } = productValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }

    try {
        const result = await updateProductById(req.params.id, req.body);
        return successResponse(res, result, "Product updated successfully.");
    } catch (err) {
        if (err.message.startsWith('Product not found')) {
            return notFoundResponse(res, err.message);
        }
        return errorResponse(res, err.message);
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const result = await deleteProductById(req.params.id);
        return successResponse(res, {}, result);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// List All Products
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await getAllProducts(page, limit);
        return successResponse(res, result, "Products fetched successfully.");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};