const Joi = require("joi");

module.exports.schema = Joi.object({
  frame: Joi.object({
    name: Joi.string().required(),
    brand: Joi.string().required(),
    color: Joi.string().required(),
    material: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      url: Joi.string().allow("", null).uri(),
      filename: Joi.string().allow("", null),
    }).optional(),
  }).required(),
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
