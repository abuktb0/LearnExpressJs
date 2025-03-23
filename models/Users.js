const mongoose = require("mongoose")
const Joi = require("joi")
const jwt = require("jsonwebtoken")

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase:true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }   
},{
    timestamps: true
})

usersSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.SECRET_KEY)
}

const userModel = mongoose.model("userSchema", usersSchema)

const registerSchema = (obj) => {
   const Schema = Joi.object({
        email: Joi.string().email().lowercase().trim().required(),
        password: Joi.string().trim().required(),
        username: Joi.string().trim().lowercase().required()
   })
   return Schema.validate(obj)
}
const loginSchema = (obj) => {
   const Schema = Joi.object({
        email: Joi.string().email().lowercase().trim().required(),
        password: Joi.string().trim().required(),
   })
   return Schema.validate(obj)
}
const validateUpdateUser = (obj) => {
    const Schema = Joi.object({
         email: Joi.string().email().lowercase().trim(),
         password: Joi.string().trim(),
         username: Joi.string().trim().lowercase()
    })
    return Schema.validate(obj)
 }
module.exports = {
    userModel,
    registerSchema,
    loginSchema,
    validateUpdateUser
}