
const joi = require("joi");
const  admin = require("../models/auth");
const jwt = require('jsonwebtoken');
const validate_admin = (req, res, next)=>{
    const schema = joi.object({
        username:joi.string().email().required(),
        password:joi.string().min(8).required()
    })
    const {error, value} = schema.validate(req.body)
    if(error){
        return res.status(400).json({message:error?.message})
    }

    next()
}


const studentloginvarify = async(req,res, next)=>{
    const schema = joi.object({
        enrollno:joi.required(),
    })
    const {error, value} = schema.validate(req.body)
    if(error){
        console.log(error);
        return res.status(400).json({message:error?.message})
    }
    next()
}


const Token_validator = async(req, res, next)=>{
    const {accessToken, refeshToken} = req.cookies
    // console.log("printing", refeshToken);
    if(!refeshToken) return res.status(401).json({message:"Invaild Token"})
    if(accessToken){
        const decodedToken = jwt.verify(accessToken, process.env.TOKEN_SECRET_KEY)
        console.log(decodedToken);
        const checktoken = await admin.findOne({username : decodedToken.username})
        if(checktoken){
            next()
        }else{
            return res.status(401).json({message:'Invaild Token'})
        }
        
    }else if(!accessToken){
        if(refeshToken){
            renewToken(req, res, next);
        }else{
            res.status(400).json({message:'token Expired'})
        }
    }

 
}

const renewToken = (req, res, next)=>{
    const refeshtoken = req.cookies.refeshToken;
    // console.log('refresh', refeshtoken);
    const decoded = jwt.verify(refeshtoken, process.env.TOKEN_SECRET_KEY)
    const accessToken = jwt.sign({username:decoded?.username},process.env.TOKEN_SECRET_KEY, {expiresIn:'10m'})
    res.cookie('accessToken', accessToken, {maxAge:10 * 60000, httpOnly:true, secure:true, sameSite:'strict'});
    next()
}

const feeValidation =(req, res, next)=>{
    const schema = joi.object({
        enroll_no:joi.string().required(),
        s_name:joi.string().required(),
        s_class:joi.string().required(),
        Months:joi.string().required(),
        amount:joi.string().required().max(5)
    })
    const {error, value} = schema.validate(req.body)
    if(error){
        return res.status(400).json({message:error?.message})
    }
    next()
}

module.exports={
    validate_admin, Token_validator, feeValidation, studentloginvarify
}