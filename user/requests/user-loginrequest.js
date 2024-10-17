import Joi from 'joi';


const Loginschema = Joi.object({
    email: Joi.string()
        .email() 
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),


    password: Joi.string()
        .min(8) 
        .max(30) 
        .required()
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).+$/) // 
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must be at most 30 characters long',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'Password is required',
        }),
});


export{Loginschema}
