const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  image: Joi.string().uri().allow('', null).optional(),
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  country: Joi.string().allow('').optional(),
});

module.exports = listingSchema;
