import Joi from "joi";


const carSchema = Joi.object({
  //Joi Schema for validating the Manufacturer data inserted by the user
  manufacturer: Joi.string().min(2).max(50).required()
    .messages({
      'string.base': 'Manufacturer should be a type of string',
      'string.empty': 'Manufacturer cannot be empty',
      'string.min': 'Manufacturer should have at least 2 characters',
      'string.max': 'Manufacturer should have at most 50 characters',
      'any.required': 'Manufacturer is a required field'
    }),
  model: Joi.string().min(2).max(50).required()
    .messages({
      'string.base': 'Model should be a type of string',
      'string.empty': 'Model cannot be empty',
      'string.min': 'Model should have at least 2 characters',
      'string.max': 'Model should have at most 50 characters',
      'any.required': 'Model is a required field'
    }),
  year: Joi.number().integer().min(1886).max(new Date().getFullYear()).required()
    .messages({
      'number.base': 'Year should be a number',
      'number.integer': 'Year should be an integer',
      'number.min': 'Year cannot be before 1886',
      'number.max': `Year cannot be after ${new Date().getFullYear()}`,
      'any.required': 'Year is a required field'
    })
});

export {carSchema}