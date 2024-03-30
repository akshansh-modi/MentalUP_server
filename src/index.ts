// as we are using typescript we dont need to type const something = require('something') , we will be able to use import

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
// import 'dotenv/config'
import {userRouter} from "./routes/user"
import { coachRouter } from './routes/coach';
const app = express();

// middleware stack 
app.use(express.json())//middleware everytime data comes from an endpoint in this api we want it to be in json format ,  
//learn cors
app.use(cors())// help us in connection from our react app 


//now whenever we are gonna make a request to the user we know that for a fact we are making a request to localhost:3001/user
app.use("/user",userRouter)
app.use("/coach",coachRouter)
// mongoose.connect(process.env.Mongodbconnect)
async function connectToDatabase() {
    try {
      await mongoose.connect(process.env.Mongodbconnect);
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }
  
  connectToDatabase();
// console.log(process.env.Mongodbconnect)




app.listen(3001,()=>{console.log("server started")})