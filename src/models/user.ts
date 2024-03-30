// import {Schema , model} from 'mongoose';
// import express from 'express';

// // since we are using typescript ,remember we have to create interfaces so that we define the type of our object 
// export interface IUser{
//     _id: string ;
//     username: string;
//     password : string;
//     availableMoney: number;
//     purchasedItems:string[];
// }

// // create a user model
// const userSchema = new Schema<IUser>({
//     // _id is not defined because it is automatically created by mongodb
//     username:
//     {type:String,required:true,unique:true},
//     password:{type:String, required:true},
//     availableMoney:{type:Number, default:30000},
//     purchasedItems:[{type:Schema.Types.ObjectId,ref:"product",default:[]}],   
// // we can ref to another field inside defination of a field
 
// }
// )

 
// export const UserModel = model<IUser>("user",userSchema);

import {Schema,model} from"mongoose";
import express from 'express';
import { StringMappingType } from "typescript";

export interface IUser{
    _id:string;
    username:string;
    password:string;
    email:string,
    mobile:string,
    appointments:string[];

}

const userSchema = new Schema<IUser>({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    mobile:{type:String,required:true},
    appointments:[{type:Schema.Types.ObjectId,ref:"appointment",default:[]}]
})

export const UserModel = model<IUser>("user",userSchema);