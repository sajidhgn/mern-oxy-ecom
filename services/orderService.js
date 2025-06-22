const Product = require('../models/Product');
const Order = require('../models/Order');

// Helper to validate and format items
const formatOrderItems = async (items) => {
    const formattedItems = [];

    for (const item of items) {
        const { productId, quantity = 1, price, color = 'White', size = 'M' } = item;

        // Validate required fields
        if (!productId || !price || quantity < 1) {
            throw new Error(`Invalid item: ${productId}. Missing required fields.`);
        }

        // Fetch product to get name and generate SKU
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const productName = product.title;
        const sku = `SKU-${productId}-${color}-${size}`;

        formattedItems.push({
            productId,
            productName,
            color,
            size,
            sku,
            quantity,
            price
        });
    }

    return formattedItems;
};

// Main addOrder function
const addOrder = async (orderData) => {
    const {
        user,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod = 'COD',
        paymentStatus = 'Pending',
        orderStatus = 'Pending'
    } = orderData;

    // Validate required fields
    if (!user || !items || !Array.isArray(items) || items.length === 0) {
        throw new Error('User and valid items array are required.');
    }

    // Format and validate each order item
    const formattedItems = await formatOrderItems(items);

    // Optional: Validate totalAmount matches calculated total from items
    const calculatedTotal = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalAmount && Math.abs(totalAmount - calculatedTotal) > 0.01) {
        throw new Error('Total amount does not match calculated total from items.');
    }

    // Create new order object
    const order = new Order({
        user,
        items: formattedItems,
        totalAmount: totalAmount || calculatedTotal,
        shippingAddress,
        paymentMethod,
        paymentStatus,
        orderStatus
    });

    // Save order
    await order.save();

    return order;
};

// Update Order status
const updateOrderStatus = async (id, updateData) => {

    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found.");

    order.orderStatus = updateData?.orderStatus;

    await order.save();

    return order;
};


// Get all orders with pagination
const getAllOrders = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        Order.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        Order.countDocuments()
    ]);

    return {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: orders
    };
};

module.exports = {
    addOrder,
    updateOrderStatus,
    getAllOrders
};