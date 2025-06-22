const Joi = require('joi');

const orderValidation = (reqBody) => {

const schema = Joi.object({
  user: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  items: Joi.array().required(),
  shippingAddress: Joi.object().required(),
});

 return schema.validate(reqBody);

}

module.exports = { orderValidation };