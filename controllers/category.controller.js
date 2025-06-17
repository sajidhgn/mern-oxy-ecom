const Category = require('../models/Category');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/apiResponses');
const { categoryValidation } = require('../validations/categoryValidation');

// Add
exports.addCategory = async (req, res) => {

    const { error } = categoryValidation(req.body);

    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }

    try {
        const { name, brand_id } = req.body;

        const existingCategories = await Category.find({ 'name': name, 'brand_id': brand_id });

        if (existingCategories.length > 0) {
            return notFoundResponse(res, 'Duplicate category is not allowed');
        }

        const category = new Category({ name, brand_id });

        await category.save();

        return successResponse(res, {}, "Category added successfully.");

    } catch (error) {
        return errorResponse(res, error.message);
    }
};



// Edit
exports.getCategory = async (req, res) => {

    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) return notFoundResponse(res, "Category not found.");
        res.json(category);

    } catch (error) {
        return notFoundResponse(res, error.message)
    }
};

// Update
exports.updateCategory = async (req, res) => {
  const { id } = req.params;

  const { error } = categoryValidation(req.body);
  if (error) {
    return notFoundResponse(res, error.details[0].message);
  }

  try {
    const { name, brand_id } = req.body; // 'brand' should be the ObjectId of the brand

    // Check if the category exists
    const category = await Category.findById(id);
    if (!category) {
      return notFoundResponse(res, 'Category not found.');
    }

    // Check for duplicate: another category with the same name and brand
    const duplicate = await Category.findOne({
      _id: { $ne: id },
      name: name,
      brand_id: brand_id
    });

    if (duplicate) {
      return notFoundResponse(res, 'Duplicate category is not allowed');
    }

    // Update the category using findByIdAndUpdate
    await Category.findByIdAndUpdate(id, { name, brand_id });

    return successResponse(res, {}, 'Category updated successfully.');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};


// Delete
exports.deleteCategory = async (req, res) => {

    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) return errorResponse(res, "Category not found.");

        await Category.findByIdAndDelete(id);
        return successResponse(res, {}, 'Category deleted successfully.');

    } catch (error) {
        return errorResponse(res, err.message);
    }
};

// List
exports.getCategories = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const categories = await Category.find().skip(skip).limit(limit).sort({ createdAt: -1 });

        const total = await Category.countDocuments();

        if (!categories) return errorResponse(res, "Categories not available.");
        res.json({
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: categories,
        });

    } catch (error) {
        return errorResponse(res, err.message);
    }
};