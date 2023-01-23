const express = require("express")
const { body, validationResult } = require("express-validator")
const router = express.Router()
const User = require("../models/User.schema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const isLoggedIn = require("../middleware/isLoggedin")

/***************************************************************
 * @route - http://127.0.0.1:4000/api/auth/createuser
 * @type - POST
 * @description - create user in the database, no login required
 ***************************************************************/

router.post("/createuser",
    // user email must be an email
    body('email', "Enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body('name', "name must be 3 characters").isLength({ min: 3 }),    
    body('password', "Password must be 5 characters").isLength({ min: 5 }),    
    
    async (req, res)=>{
try {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    // if there are errors returns bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // taking input from the body
    const { name, email, password } = req.body

    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required to create the user"
        })
    }

    // checking for already existing user
    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({
            success: false,
            message: "User already exists in the database"
        })
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    // if user does not exists already then create one
    const user = await User.create({
        name, 
        email,
        password: encryptedPassword
    }) 

    // generating token for register
    const token = jwt.sign(
        {
            id: user._id,
        },
        process.env.SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    )

    user.password = undefined
    user.token = token
        
    return res.status(200).json({
        success: true,
        message: "User created in the database",
        user,
    })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})



/***************************************************************
 * @route - http://127.0.0.1:4000/api/auth/login
 * @type - POST
 * @description - allow user to login with correct credentials
 ***************************************************************/

router.post("/login",
    // user email must be an email
    body('email', "Enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body('password', "Password must be 5 characters").isLength({ min: 5 }),    
    
    async (req, res)=>{
try {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    // if there are errors returns bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // taking input from the body
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required to create the user"
        })
    }

    // checking for user exists in db or not
    const existingUser = await User.findOne({email})
    if(!existingUser){
        return res.status(400).json({
            success: false,
            message: "User doesnot exists in the database"
        })
    }

    const comparePassword = await bcrypt.compare(password, existingUser.password)

    if(existingUser && comparePassword){

        // generating token for register
        const token = jwt.sign(
            {
                id: existingUser._id,
            },
            process.env.SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
        existingUser.password = undefined
        existingUser.token = token

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: existingUser,
        })
    }

    return res.status(400).json({
        success: false,
        message: "Login with correct credentials"
    })


    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})




/***************************************************************
 * @route - http://127.0.0.1:4000/api/auth/getuser
 * @type - POST
 * @description - allow user to login with correct credentials
 ***************************************************************/

router.post('/getuser', isLoggedIn, async (req, res)=>{

    try {
        const userID = req.user.id
        const user = await User.findById(userID).select("-password")

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Please login"
            })
        }

        return res.status(200).json({
            success: true,
            message: user
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        })   
    }
})




module.exports = router