const Product = require("../models/Product");

// Add new product
const addProduct = async (productData) => {
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
  } = productData;

  let variations = inputVariations;

  // Fallback variations if none are provided
  if (!variations || variations.length === 0) {
    variations = [
      {
        color: "White",
        sizes: [
          {
            size: "M",
            stock: 0,
            sku: `DEFAULT-${title.replace(/\s+/g, "-").toUpperCase()}-M`,
          },
        ],
      },
    ];
  }

  // Check for existing product with same title
  const existingProducts = await Product.find({ title });
  if (existingProducts.length > 0) {
    throw new Error("Duplicate product is not allowed");
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
    variations,
  });

  await product.save();

  return product;
};

// Get product by ID
const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found.");
  return product;
};

// Update product by ID
const updateProductById = async (id, updateData) => {
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
  } = updateData;

  // Default fallback if no variations provided
  if (!variations || variations.length === 0) {
    variations = [
      {
        color: "White",
        sizes: [
          {
            size: "M",
            stock: 0,
            sku: `DEFAULT-${title.replace(/\s+/g, "-").toUpperCase()}-M`,
          },
        ],
      },
    ];
  }

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found.");

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

  return product;
};

// Delete product by ID
const deleteProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found.");

  await Product.findByIdAndDelete(id);

  return "Product deleted successfully.";
};

// Get all products with pagination
const getAllProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(),
  ]);

  return {
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    data: products,
  };
};

module.exports = {
  addProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllProducts,
};
