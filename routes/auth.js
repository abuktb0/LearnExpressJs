const router = require("express").Router()
const {userModel, registerSchema, loginSchema} = require("../models/Users")
const bcrypt = require("bcrypt")
const expressAsyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

/**
 * @desc // ! Register new user
 * @route /api/auth/register
 * @method POST
 * @access Public
 */
router.post("/register", expressAsyncHandler(
    async (req, res) => {
        const {email, password, username} = req.body
        const {error} = registerSchema(req.body)
        if(error) return res.status(400).json(error.details[0].message)

        let user = await userModel.findOne({email: email})
        if(user) return res.status(400).json({message: "user is already registered"})

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        user = new userModel({
            email, password: hashedPassword, username
        }) 
        const result = await user.save()
        const token = user.generateToken()

        const {password:pass, ...other} = result._doc
        res.status(200).json({...other, token})
    }
))


/**
 * @desc // ! Login 
 * @route /api/auth/login
 * @method POST
 * @access Public
 */
router.post("/login", expressAsyncHandler(
    async (req, res) => {
      const {email, password} = req.body
      const {error} = loginSchema(req.body)
      if (error) return res.status(400).json(error.details[0].message)

      const user = await userModel.findOne({email:email})
      if(!user) return res.status(404).json({message: "404 user not Found"})
        
      const validPassword = await bcrypt.compare(password, user.password) 
      if (!validPassword) return res.status(400).json({message: "email or password is invalid"})
        
      const token = user.generateToken()
      const {password:pass, ...other} = user._doc

      res.status(200).json({...other, token})
    }
))

module.exports = router