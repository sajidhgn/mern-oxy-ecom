const Brand = require('../models/Brand');
const { brandValidation } = require('../validations/brandValidation');

// Add multiple brands
const addBrands = async (brands) => {
    if (!Array.isArray(brands) || brands.length === 0) {
        throw new Error("Brands list must be a non-empty array.");
    }

    // Sanitize input to allow only 'name' field
    const sanitizedBrands = brands.map(brand => ({ name: brand.name?.trim() }));

    // Validate each brand
    for (const brand of sanitizedBrands) {
        const { error } = brandValidation(brand);
        if (error) throw new Error(error.details[0].message);
    }

    // Check existing brands in DB
    const names = sanitizedBrands.map(b => b.name);
    const existingBrands = await Brand.find({ name: { $in: names } });
    const existingNames = existingBrands.map(b => b.name);

    const uniqueBrands = sanitizedBrands.filter(b => !existingNames.includes(b.name));

    if (uniqueBrands.length === 0) {
        throw new Error("All brands already exist.");
    }

    // Insert new brands
    const inserted = await Brand.insertMany(uniqueBrands);
    return inserted;
};

// Get single brand by ID
const getBrandById = async (id) => {
    const brand = await Brand.findById(id);
    if (!brand) throw new Error("Brand not found.");
    return brand;
};

// Update brand by ID
const updateBrandById = async (id, updateData) => {
    const { error } = brandValidation(updateData);
    if (error) throw new Error(error.details[0].message);

    const brand = await Brand.findById(id);
    if (!brand) throw new Error("Brand not found.");

    brand.name = updateData.name;

    await brand.save();
    return brand;
};

// Delete brand by ID
const deleteBrandById = async (id) => {
    const brand = await Brand.findById(id);
    if (!brand) throw new Error("Brand not found.");

    await Brand.findByIdAndDelete(id);
    return "Brand deleted successfully.";
};

// Get all brands with pagination
const getAllBrands = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [brands, total] = await Promise.all([
        Brand.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        Brand.countDocuments()
    ]);

    return {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: brands
    };
};

module.exports = {
    addBrands,
    getBrandById,
    updateBrandById,
    deleteBrandById,
    getAllBrands
};