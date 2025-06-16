const Joi = require('joi');

const sizeSchema = Joi.object({
  size: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL'),
  stock: Joi.number().integer().min(0),
  sku: Joi.string(),
  price: Joi.number().positive()
});

const variationSchema = Joi.object({
  color: Joi.string(),
  sizes: Joi.array().items(sizeSchema).min(1)
});

const productValidation = (reqBody) => {

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  thumbnail: Joi.string(),
  category: Joi.string(),
  brand: Joi.string(),
  basePrice: Joi.number().positive().required(),
  discountPercentage: Joi.number().positive(),
  variations: Joi.array().items(variationSchema),
  images: Joi.array()
});

 return schema.validate(reqBody);

}

module.exports = { productValidation };