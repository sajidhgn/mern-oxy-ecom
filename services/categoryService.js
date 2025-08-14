const Category = require("../models/Category");

// Add new category
const addCategory = async (name, brand_id) => {
  const existingCategories = await Category.find({ name, brand_id });

  if (existingCategories.length > 0) {
    throw new Error("Duplicate category is not allowed");
  }

  const category = new Category({ name, brand_id });
  await category.save();

  return category;
};

// Get category by ID
const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error("Category not found.");
  }
  return category;
};

// Update category by ID
const updateCategoryById = async (id, name, brand_id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error("Category not found.");
  }

  const duplicate = await Category.findOne({
    _id: { $ne: id },
    name,
    brand_id,
  });

  if (duplicate) {
    throw new Error("Duplicate category is not allowed");
  }

  await Category.findByIdAndUpdate(id, { name, brand_id });
  return "Category updated successfully.";
};

// Delete category by ID
const deleteCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error("Category not found.");
  }

  await Category.findByIdAndDelete(id);
  return "Category deleted successfully.";
};

// Get all categories with pagination
const getAllCategories = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Category.countDocuments(),
  ]);

  return {
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    data: categories,
  };
};

module.exports = {
  addCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getAllCategories,
};
