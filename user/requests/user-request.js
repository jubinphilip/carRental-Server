import Joi from 'joi';

const userSchema = Joi.object({
    username: Joi.string().required().min(3).max(30).regex(/^[a-zA-Z\s]+$/).messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username cannot be empty',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must be at most 30 characters long',
        'string.pattern.base': 'Username must contain only letters and spaces',
      }),
    email: Joi.string().email().required().messages({
        'string.base': '"Email" should be a type of text',
        'string.empty': '"Email" cannot be an empty field',
        'string.email': '"Email" must be a valid email',
        'any.required': '"Email" is a required field'
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.base': '"Phone" should be a type of text',
        'string.empty': '"Phone" cannot be an empty field',
        'string.pattern.base': '"Phone" must be a valid phone number with 10 digits',
        'any.required': '"Phone" is a required field'
    }),
});


const UserDetailsSchema = Joi.object({


  city: Joi.string()
    .required()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-z\s]+$/) 
    .messages({
      'string.base': 'City must be a string',
      'string.empty': 'City cannot be empty',
      'string.min': 'City must be at least 2 characters long',
      'string.max': 'City must be at most 50 characters long',
      'string.pattern.base': 'City must only contain letters and spaces',
    }),
  state: Joi.string()
    .required()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-z\s]+$/) 
    .messages({
      'string.base': 'State must be a string',
      'string.empty': 'State cannot be empty',
      'string.min': 'State must be at least 2 characters long',
      'string.max': 'State must be at most 50 characters long',
      'string.pattern.base': 'State must only contain letters and spaces',
    }),
  country: Joi.string()
    .required()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-z\s]+$/)
    .messages({
      'string.base': 'Country must be a string',
      'string.empty': 'Country cannot be empty',
      'string.min': 'Country must be at least 2 characters long',
      'string.max': 'Country must be at most 50 characters long',
      'string.pattern.base': 'Country must only contain letters and spaces',
    }),
  pincode: Joi.string()
    .required()
    .pattern(/^[0-9]{5,6}$/)
    .messages({
      'string.base': 'Pincode must be a string of digits',
      'string.empty': 'Pincode cannot be empty',
      'string.pattern.base': 'Pincode must be a valid 5 or 6 digit number',
    }),
  password: Joi.string()
    .required()
    .min(8)
    .max(30)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).+$/)
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must be at most 30 characters long',
      'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
});

const namePattern = /^[a-zA-Z\s]+$/;
const editUserSchema = Joi.object({
  userid: Joi.string().required(),  
  username: Joi.string()
      .pattern(namePattern)  
      .min(3)
      .max(30)
      .optional(), 
  email: Joi.string()
      .email()
      .optional(), 
  phone: Joi.string()
      .pattern(/^[0-9]{10}$/) 
      .optional(),  
  city: Joi.string()
      .pattern(namePattern)  
      .optional(),  
  state: Joi.string()
      .optional(),  
  country: Joi.string()
      .pattern(namePattern)  
      .optional(),  
  pincode: Joi.string()
      .pattern(/^[0-9]{6}$/) 
      .optional(),  
});


export {userSchema, UserDetailsSchema,editUserSchema} 