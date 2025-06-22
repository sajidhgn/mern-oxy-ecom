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

const { orderValidation } = require('../validations/orderValidation');


// Add Category
exports.addNewOrder = async (req, res) => {
    const { error } = orderValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }
    try {
        await addOrder(req.body);
        return successResponse(res, {}, "Order created successfully.");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await getAllOrders(page, limit);
        return successResponse(res, result, "Orders fetched successfully.");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};