import { UserModel} from "../models/user"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Request,Response} from 'express'
import { UserErrors } from "../error";

export const signUp = async (req:Request,res:Response)=>{
    const {username,password,email,mobile} = req.body;
    if(!username || !password || !email || !mobile){
        return res.status(400).json({error:"Please fill all the fields"})
    }
    // check existing user , evrything is unique
    let existingUser;
    try{
        existingUser = await UserModel.findOne({$or: [{email:email}, {username:username}, {mobile:mobile}]});
    

    if(existingUser){
        if(existingUser.username==username){
            return res.status(400).json({type:UserErrors.USER_ALREADY_EXISTS})
        }
        else if(existingUser.email==email){
            return res.status(400).json({type:UserErrors.EMAIL_ALREADY_EXISTS})
        }
        else if(existingUser.mobile==mobile){
            return res.status(400).json({type:UserErrors.MOBILE_ALREADY_EXISTS})
        }
    }

    // hash password
    const hashedPassword=await bcrypt.hash(password,12);
    const newUser = new UserModel({
        username:username,
        password:hashedPassword,
        email:email,
        mobile:mobile,
        appointments:[]
    })
    await newUser.save()
    return res.status(200).json({
        message:"User created successfully",
        user:newUser
    })
}
catch(err){
    res.status(400).json({err}) ;
}

}

export const login = async (req:Request,res:Response)=>{

const {username,password} = req.body;
if(!username || !password){
    return res.status(400).json({error:"Please fill all the fields"})
}
let existingUser;
try{
    existingUser = await UserModel.findOne({username:username});
    // if(!existingUser){
    //     return res.status(400).json({type:UserErrors.NO_USER_FOUND})
    // }
    // const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
    // if(!isPasswordCorrect){
    //     return res.status(400).json({type:UserErrors.WRONG_CREDETIALS})
    // }
    // const token = jwt.sign({username:existingUser.username,userId:existingUser._id},"secret",{expiresIn:"1h"});
    // return res.status(200).json({
    //     message:"User logged in successfully",
    //     token:token
    // })   
    if(!existingUser){
        return res.status.json({type:UserErrors.NO_USER_FOUND})
    }
    const isPasswordCorrect=await bcrypt.compare(password,existingUser.password);
    if(!isPasswordCorrect){
        return res.status.json({type:UserErrors.WRONG_CREDETIALS})
    }
    const token=jwt.sign({username:existingUser.username,userId:existingUser._id},process.env.SECRET);
    return res.status(200).json({
        message:"User logged in successfully",
        token:token
    })

}
catch(err){
    return res.status(400).json({err});
}
}
  

export const signout = async (req:Request,res:Response)=>{
    res.clearCookie("token");
    return res.json({
        message:"User signed out successfully"
    })

}



export const getUserInfo=async(req:Request,res:Response)=>{

const id=req.params.id;
let user;
try{
    user=await UserModel.findByIdAndDelete(id);
}
catch(err){
    res.status(400).json({err})
}
if(!user) {
    return res.status(400).json({ message: "Unable to delete" });
}
return res.status(200).json({ message: "Successfully Deleted"});

}

