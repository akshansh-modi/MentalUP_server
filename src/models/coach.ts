import {Schema, model} from 'mongoose';
import express from 'express';
export interface ICoach{
    _id:string;
    name:string;
    email:string;
    password:string;
    mobile:string;
    about:string;
    calendyLink:string;
    imageURL:string;
}

const coachSchema = new Schema<ICoach>({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    mobile:{type:String,required:true},
    about:{type:String,required:true},
    calendyLink:{type:String,required:true,unique:true},
    imageURL:{type:String,required:true}
})

export const CoachModel = model<ICoach>("coach",coachSchema);