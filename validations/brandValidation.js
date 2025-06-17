const Joi = require('joi');

const brandValidation = (reqBody) => {

const schema = Joi.object({
  name: Joi.string().required()
});

 return schema.validate(reqBody);

}

module.exports = { brandValidation };