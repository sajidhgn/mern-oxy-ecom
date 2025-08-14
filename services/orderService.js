const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const User = require("../models/User");

const createOrderAndCheckout = async (orderData) => {
  try {
    const {  userId,
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    orderStatus,
    isPaid,
    } = orderData;

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error(400, "Items array is required and cannot be empty.");
    }

    const user = await User.findById(userId);
    if (!user) throw new Error(400, "User not found" );

    // Calculate total price
    const totalAmount = items.reduce((sum, item) => {
      const total = item.price * item.quantity;
      const discount = item.discountPercentage
        ? (total * item.discountPercentage) / 100
        : 0;
      return sum + (total - discount);
    }, 0);

      const userEmail = await User.findById(userId);

    // Create pending order in DB
      const order = await Order.create({
    userId,
    userEmail: userEmail.email,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    orderStatus,
    isPaid,
    paidAt: new Date(),
    deliveredAt: new Date(),
  });

    // Prepare Stripe line items
    const lineItems = items.map((item) => {
      let finalPrice = item.price;
      if (item.discountPercentage && item.discountPercentage > 0) {
        finalPrice -= (item.price * item.discountPercentage) / 100;
      }
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productName,
            images: [item.thumbnail],
          },
          unit_amount: Math.round(finalPrice * 100),
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail.email,
      line_items: lineItems,
      success_url: `https://b8f7f945b66b.ngrok-free.app/success`,
      cancel_url: `https://b8f7f945b66b.ngrok-free.app/cancel`,
      metadata: { order_id: order._id.toString() },
    });

    console.log({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Create Order & Checkout Error:", error);
    throw new Error(400, error.message );
  }
};

// 2️⃣ Stripe Webhook (Payment Confirmation)
const stripeWebhook = async (req, res) => {
  let event;
  
  try {
    const sig = req.headers["stripe-signature"];
    
    // Make sure we're using the raw body as a Buffer
    const payload = req.body;
    
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log('✅ Webhook signature verified successfully');
    
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    console.error("Headers:", req.headers);
    console.error("Body type:", typeof req.body);
    console.error("Body length:", req.body?.length);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle event types
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const orderId = session.metadata?.order_id;
        
        if (!orderId) {
          console.error("No order_id found in session metadata");
          return res.status(400).send("Missing order_id in metadata");
        }

        // Update order in database
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            paymentStatus: "Paid",
            orderStatus: "Processing", 
            isPaid: true,
            paidAt: new Date(),
            transaction: {
            stripeSessionId: session.id,
            paymentIntentId: session.payment_intent
        }
          },
          { new: true }
        );

        if (!updatedOrder) {
          console.error(`Order ${orderId} not found in database`);
          return res.status(404).send("Order not found");
        }

        console.log(`✅ Order ${orderId} marked as paid successfully`);
        break;
        
      case "payment_intent.succeeded":
        console.log("💳 Payment succeeded:", event.data.object.id);
        break;
        
      case "payment_intent.payment_failed":
        console.log("❌ Payment failed:", event.data.object.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Acknowledge receipt of the event
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Webhook processing error");
  }
};

/**
 * Update order status
 */
const updateOrderStatus = async (id, { orderStatus }) => {
  const order = await Order.findById(id);
  if (!order) throw new Error(404, "Order not found.");

  order.orderStatus = orderStatus || order.orderStatus;
  await order.save();
  return order;
};

/**
 * Get all orders with pagination
 */
const getAllOrders = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Order.countDocuments(),
  ]);

  return {
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    data: orders,
  };
};

module.exports = {
  createOrderAndCheckout,
  stripeWebhook,
  updateOrderStatus,
  getAllOrders
};
