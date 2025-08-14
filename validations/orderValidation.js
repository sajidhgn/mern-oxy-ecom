// validations/orderValidation.js
const Joi = require("joi");

/**
 * Validation for creating a new order
 */
const orderValidation = (reqBody) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          productName: Joi.string().required(),
          quantity: Joi.number().integer().min(1).default(1),
          price: Joi.number().positive().required(),
          sku: Joi.string().required(),
          color: Joi.string().required(),
          size: Joi.string().required(),
          thumbnail: Joi.string().required(),
          categoryId: Joi.string().required(),
          brandId: Joi.string().required(),
          discountPercentage: Joi.number().positive().optional(),
        })
      )
      .required()
      .min(1),
    shippingAddress: Joi.object({
      fullName: Joi.string().required(),
      address1: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    totalAmount: Joi.number().positive().optional(),
    paymentStatus: Joi.string().optional(),
    orderStatus: Joi.string().optional(),
    paymentMethod: Joi.string().required(),
    paymentStatus: Joi.string().required(),
    isPaid: Joi.boolean().required(),
    paidAt: Joi.date().optional(),
    deliveredAt: Joi.date().optional(),
    transaction: Joi.object({
      stripeSessionId: Joi.string().allow("").optional(),
      paymentIntentId: Joi.string().allow("").optional(),
    }).optional(),
  });

  return schema.validate(reqBody, { abortEarly: false });
};

/**
 * Validation for updating order status
 */
const orderStatusValidation = (reqBody) => {
  const schema = Joi.object({
    orderStatus: Joi.string()
      .valid("Pending", "Processing", "Shipped", "Delivered", "Cancelled")
      .required(),
  });

  return schema.validate(reqBody, { abortEarly: false });
};

module.exports = {
  orderValidation,
  orderStatusValidation,
};
