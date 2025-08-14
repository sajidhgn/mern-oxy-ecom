const {
   createOrderAndCheckout,
    updateOrderStatus,
    getAllOrders
} = require('../services/orderService');

const {
    successResponse,
    errorResponse,
    notFoundResponse
} = require('../utils/apiResponses');

const { orderValidation, orderStatusValidation } = require('../validations/orderValidation');


// Add Category
exports.addNewOrder = async (req, res) => {
    const { error } = orderValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }
    try {
        await createOrderAndCheckout(req.body);
        return successResponse(res, {}, "Order created successfully.");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// Update Order
exports.updateOrder = async (req, res) => {

    const { error } = orderStatusValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }

    try {
        const result = await updateOrderStatus(req.params.id, req.body);
        return successResponse(res, result, "Order updated successfully.");
    } catch (err) {
        if (err.message.startsWith('Order not found')) {
            return notFoundResponse(res, err.message);
        }
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