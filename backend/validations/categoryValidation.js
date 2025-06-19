const Joi = require('joi');

const categoryValidation = (reqBody) => {

const schema = Joi.object({
  name: Joi.string().required(),
  brand_id: Joi.string().required()
});

 return schema.validate(reqBody);

}

module.exports = { categoryValidation };