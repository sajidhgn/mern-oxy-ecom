const {
   addOrder,
    updateOrderStatus,
    getAllOrders
} = require('../services/orderService');

const {
    successResponse,
    errorResponse,
    notFoundResponse
} = require('../utils/apiResponses');


// Add Category
exports.addOrder = async (req, res) => {
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