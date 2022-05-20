const User=require('../models/User')
const {StatusCodes}=require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const register=async(req,res)=>{
    // const{name,email,password}=req.body
    // if(!name || !email || !password)
    // {
    //     throw new BadRequestError('Please provide name,email, password')
    // }

    //mongoose middleware will run before below line  
    const user=await User.create({...req.body})
    console.log(user);
    const token=user.createJWT();
    console.log(token)
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}

const login=async(req,res)=>{
    const{email,password}=req.body
    if(!email || !password)
    {
        throw new BadRequestError('please provide email and password')
    }
    const user=await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('invalid email')
    }
    const isMatch=await user.comparePassword(password)
    if(!isMatch)
    {
        throw new UnauthenticatedError('invalid password')
    }
    const token=await user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports={register,login}