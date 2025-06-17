const Brand = require('../models/Brand');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/apiResponses');
const { brandValidation } = require('../validations/brandValidation');

// Add
exports.addBrand = async (req, res) => {
  let brands = req.body.brands;

  if (!Array.isArray(brands) || brands.length === 0) {
    return notFoundResponse(res, "Brands list must be a non-empty array.");
  }

  // Step 1: Sanitize each object to allow only 'name'
  brands = brands.map(brand => ({ name: brand.name?.trim() }));

  try {
    // Step 2: Validate each brand
    for (const brand of brands) {
      const { error } = brandValidation(brand);
      if (error) {
        return notFoundResponse(res, error.details[0].message);
      }
    }

    // Step 3: Remove duplicates already in DB
    const names = brands.map(b => b.name);
    const existingBrands = await Brand.find({ name: { $in: names } });
    const existingNames = existingBrands.map(b => b.name);

    const uniqueBrands = brands.filter(b => !existingNames.includes(b.name));

    if (uniqueBrands.length === 0) {
      return notFoundResponse(res, "All brands already exist.");
    }

    // Step 4: Insert only sanitized, validated brand names
    const inserted = await Brand.insertMany(uniqueBrands);

    return successResponse(res, inserted, "Brands added successfully.");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};



// Edit
exports.getBrand = async (req, res) => {

    const { id } = req.params;

    try {
        const brand = await Brand.findById(id);
        if (!brand) return notFoundResponse(res, "Brand not found.");
        res.json(brand);

    } catch (error) {
        return notFoundResponse(res, error.message)
    }
};

// Update
exports.updateBrand = async (req, res) => {
    const { id } = req.params;

    const { error } = brandValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }

    try {
        const { name } = req.body;

        // Find and update the brand
        const brand = await Brand.findById(id);
        if (!brand) {
            return notFoundResponse(res, 'Brand not found.');
        }

        brand.name = name;

        await brand.save();

        return successResponse(res, {}, 'Brand updated successfully.');

    } catch (err) {
        return errorResponse(res, err.message);
    }
};


// Delete
exports.deleteBrand = async (req, res) => {

    const { id } = req.params;

    try {
        const brand = await Brand.findById(id);
        if (!brand) return errorResponse(res, "Brand not found.");

        await Brand.findByIdAndDelete(id);
        return successResponse(res, {}, 'Brand deleted successfully.');

    } catch (error) {
        return errorResponse(res, err.message);
    }
};

// List
exports.getBrands = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const brands = await Brand.find().skip(skip).limit(limit).sort({ createdAt: -1 });

        const total = await Brand.countDocuments();

        if (!brands) return errorResponse(res, "Brands not available.");
        res.json({
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: brands,
        });

    } catch (error) {
        return errorResponse(res, err.message);
    }
};