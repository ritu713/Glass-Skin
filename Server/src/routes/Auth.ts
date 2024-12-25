import express, { Request, Response } from 'express'
//middleware to check if values entered by user are valid
import {validationResult, check} from 'express-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/User/User'
import verifyToken from '../middleware'
//routes
const router = express.Router();

//registeration route
router.post('/register', [
    check("fName", "First name is required").isString(),
    check("lName", "Last name is required").isString(),
    check("emailID", "Email is required").isEmail(),
    check("password", "Password must be at least 8 characters long").isLength({min : 8})
], async (req : Request, res : Response) => {
    try {
        //returns empty if there are no validation errors found by "check" function
        const validationError = validationResult(req.body);
        if(!validationError.isEmpty()){
            return res.status(400).json({message : validationError.array()})
        }

        //check if user already exists
        let user = await User.findOne({emailID : req.body.emailID})
        if(user){
            return res.status(400).json({message : "User already exists with this email"});
        }

        //create new user, if user DNE
        user = await User.create(req.body);

        //create JWT token which lasts for 1 week and a cookie in the result storing the token.
        const token = jwt.sign({userID : user._id}, process.env.JWT_SECRET_KEY as string, {expiresIn : "7d"})
        res.cookie("auth_token", token, {maxAge: 604800000, httpOnly : true, secure : process.env.NODE_ENV === 'production', sameSite : 'none'});

        return res.status(200).send({message : "User registered OK"})
    }
    catch(error : any){
        // console.log("Error occured : " + error);
        return res.status(500).json({message : "Something went wrong"})
    }
})

router.post('/login', [
    check("emailID", "Please enter your registered email").isEmail(),
    check("password", "Please enter your password").isString()
], async (req : Request, res : Response) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message : errors.array()})
    }

    try {
        const {emailID, password} = req.body;
        const user = await User.findOne({emailID : emailID});

        if(!user){
            return res.status(400).json({message : "Invalid credentials"})
        }

        const match = await bcrypt.compare(password, user.password)
        if(!match){
            return res.status(400).json({message : "Invalid credentials"})
        }

        const token = jwt.sign({userID : user.id}, process.env.JWT_SECRET_KEY as string, {expiresIn : "7d"});
        res.cookie("auth_token", token, {maxAge: 604800000, httpOnly : true, secure : process.env.NODE_ENV === 'production'})
        return res.status(200).json({userID : user._id});
    }
    catch(error : any){
        return res.status(500).json({message : "Server error"})
    }
})

router.get('/validate-token', verifyToken, (req : Request, res : Response) => {
    return res.status(200).send({userID : req.userID});
})

router.get('/user', verifyToken, async (req : Request, res : Response) => {
    const userID = req.userID;
    try{        
        const user = await User.findById(userID).select("-password")
        if(!user){
            return res.status(400).json({message : "User not found"})
        }
        return res.status(200).json({user})
    }
    catch(err : any){
        return res.status(500).json({message : "Something went wrong"})
    }
})

router.post('/logout', (req : Request, res : Response) => {
    res.cookie("auth_token", "", {
        expires : new Date(0)
    })
    return res.status(200);
})

export default router

