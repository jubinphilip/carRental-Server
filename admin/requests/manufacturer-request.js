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

const vehicleSchema = Joi.object({
 
  manufacturer_id: Joi.string()
      .required()
      .messages({
          'any.required': 'Select a manufacturer.'
      }),
  
  type: Joi.string()
      .required()
      .messages({
          'any.required': 'Vehicle type is required.'
      }),

  transmission: Joi.string()
      .required()
      .messages({
          'any.required': 'Transmission type is required.'
      }),

  fuel: Joi.string()
      .required()
      .messages({

          'any.required': 'Fuel type is required.'
      }),

  seats: Joi.string()
      .required()
      .messages({

          'any.required': 'Seats are required.'
      }),

      description: Joi.string()
      .custom((value, helpers) => {
        const wordCount = value.trim().split(/\s+/).length;
        console.log(wordCount)
        if (wordCount > 30) {
          return helpers.message('Description must contain at most 30 words.');
        }
        return value;
      })
      .required()
      .messages({
        'string.base': 'Description must be a string.',
        'any.required': 'Description is required.'
      })
});

export {carSchema ,vehicleSchema}