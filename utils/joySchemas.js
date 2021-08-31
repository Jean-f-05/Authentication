const Joi = require('joi');


module.exports.signUpSchema = Joi.object({
    username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

    password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),


    repeat_password: Joi.any().equal(Joi.ref('password'))
    .required()
    .options({ messages: { 'any.only': "Passwords don't match"} }),

    email: Joi.string()
    .email()
    .required()
});


module.exports.resetPasswordSchema = Joi.object({

    old_password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),


    password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),


    repeat_password: Joi.any().equal(Joi.ref('password'))
    .required()
    .options({ messages: { 'any.only': "Passwords don't match"} }),

});


module.exports.forgotPasswordSchema = Joi.object({
    email: Joi.string()
    .email()
    .required()
});


module.exports.resetUnkownPasswordSchema = Joi.object({
    password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),


    repeat_password: Joi.any().equal(Joi.ref('password'))
    .required()
    .options({ messages: { 'any.only': "Passwords don't match"} }),

})