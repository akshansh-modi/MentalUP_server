import {Schema , model} from 'mongoose';
import express from 'express';


export interface IProduct{
productName:string ;
price:number;
description:string;
stockQuantity:number;
imageURL:string;
}

const productSchema = new Schema<IProduct>({

    productName:{type:String,required:true} ,
    price:{type:Number , required:true, min:[1,'Price of product should be above 1.']},//validation error message --> pretty cool 
    description:{type:String, required:true},
    imageURL:{type:String , required:true},
    stockQuantity:{type:Number,required:true, min:[0,"Stock cant be lower than 0,"]},
})

export const ProductModel = model<IProduct>("product",productSchema)

