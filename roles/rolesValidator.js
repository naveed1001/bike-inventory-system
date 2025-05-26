const Joi = require('joi');

exports.validateCreateRole = (data) => {
    const schema = Joi.object({
        role_name: Joi.string().required().max(100).messages({
            'string.empty': 'Role name is required',
            'string.max': 'Role name must not exceed 100 characters'
        }),
    });
    return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateRole = (data) => {
    const schema = Joi.object({
        role_name: Joi.string().required().max(100).messages({
            'string.empty': 'Role name is required',
            'string.max': 'Role name must not exceed 100 characters'
        }),
    });
    return schema.validate(data, { abortEarly: false });
};