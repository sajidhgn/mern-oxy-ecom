const Product = require('../models/Product');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/apiResponses');
const { productValidation } = require('../validations/productValidation');


// Add
exports.addProduct = async (req, res) => {
    const { error } = productValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }

    try {
        const {
            title,
            description,
            basePrice,
            discountPercentage = 0,
            category,
            brand,
            thumbnail,
            images,
            variations: inputVariations,
        } = req.body;

        let variations = inputVariations;

        // Fallback variations if none are provided
        if (!variations || variations.length === 0) {
            variations = [{
                color: 'White',
                sizes: [{
                    size: 'M',
                    stock: 0,
                    sku: `DEFAULT-${title.replace(/\s+/g, '-').toUpperCase()}-M`
                }]
            }];
        }

        // Extract SKUs from current request
        const incomingSkus = variations.flatMap(variation =>
            (variation.sizes || []).map(size => size.sku)
        );

        // // Check if any of these SKUs already exist in DB
        const existingSkus = await Product.find({
            'title': title
        });

        if (existingSkus.length > 0) {
            return notFoundResponse(res, 'Duplicate product is not allowed');
        }

        const product = new Product({
            title,
            description,
            basePrice,
            discountPercentage,
            category,
            brand,
            thumbnail,
            images,
            variations
        });

        await product.save();

        return successResponse(res, {}, "Product added successfully.");

    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// Edit
exports.getProduct = async (req, res) => {

    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) return notFoundResponse(res, "Product not found.");
        res.json(product);

    } catch (error) {
        return notFoundResponse(res, error.message)
    }
};

// Update
exports.updateProduct = async (req, res) => {
    const { id } = req.params;

    const { error } = productValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }

    try {
        const {
            title,
            description,
            basePrice,
            discountPercentage = 0,
            category,
            brand,
            thumbnail,
            images,
            variations,
        } = req.body;

        // Default fallback if no variations provided
        if (!variations || variations.length === 0) {
            variations = [{
                color: 'White',
                sizes: [{
                    size: 'M',
                    stock: 0,
                    sku: `DEFAULT-${title.replace(/\s+/g, '-').toUpperCase()}-M`
                }]
            }];
        }

        // Find and update the product
        const product = await Product.findById(id);
        if (!product) {
            return notFoundResponse(res, 'Product not found.');
        }

        product.title = title;
        product.description = description;
        product.basePrice = basePrice;
        product.discountPercentage = discountPercentage;
        product.category = category;
        product.brand = brand;
        product.thumbnail = thumbnail;
        product.images = images;
        product.variations = variations;

        await product.save();

        return successResponse(res, {}, 'Product updated successfully.');

    } catch (err) {
        return errorResponse(res, err.message);
    }
};


// Delete
exports.deleteProduct = async (req, res) => {

    const { id } = req.params;

    try {

        const product = await Product.findById(id);
        if (!product) return errorResponse(res, "Product not found.");

        await Product.findByIdAndDelete(id);
        return successResponse(res, {}, 'Product deleted successfully.');

    } catch (error) {
        return errorResponse(res, err.message);
    }
};

// List
exports.getProducts = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const products = await Product.find().skip(skip).limit(limit).sort({ createdAt: -1 });

        const total = await Product.countDocuments();

        if (!products) return errorResponse(res, "Products not available.");
        res.json({
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: products,
        });

    } catch (error) {
        return errorResponse(res, err.message);
    }
};