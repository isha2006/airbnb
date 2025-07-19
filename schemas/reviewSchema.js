const Joi = require("joi");

const reviewSchema = Joi.object({
    rating: Joi.number()
        .required()
        .min(1)
        .max(5),
    comment: Joi.string()
        .required()
        .trim()
});

module.exports = reviewSchema;
