import {Router,Request,Response} from 'express'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {IUser, UserModel} from "../models/user"
import {UserErrors} from "../error"
import { isCatchClause } from 'typescript';
const router =Router(); //to organize routes

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();

    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// router.put("/:id/update-image", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { imageURL } = req.body;

//   try {
//     const user = await UserModel.findById(id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     user.imageURL = imageURL;
//     await user.save();

//     res.json({ message: "Image URL updated successfully" });
//   } catch (err) {
//     console.error("Error updating image URL:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


router.post("/register",async (req:Request,res:Response)=>{

const {username,email,password} = req.body;
// The line const { username, password } = req.body; is using destructuring assignment in JavaScript/TypeScript. Destructuring assignment allows you to extract values from objects or arrays and assign them to variables.
// const username = req.body.username;
// const password = req.body.password;

const user = await UserModel.findOne({username:username});
const emailExist= await UserModel.findOne({email:email});
try{
if(user){
  return   res.status(400).json({type:UserErrors.USER_ALREADY_EXISTS})
}
if(emailExist){
  return   res.status(400).json({type:UserErrors.EMAIL_ALREADY_EXISTS})
}


// now before storing the password we will hash it 
const hashedPassword=await bcrypt.hash(password, 10);

// create new user
const newUser= await new UserModel({
username:username,
email:email,
password:hashedPassword,
})
await newUser.save();
res.json({message:"user regiestred successfully"})
}
catch(err){
// server error
 res.status(400).json({err});

}

})
router.post("/login",async function(req:Request,res:Response){
const {username,password}=req.body
try{
  // if user exist in database
  const user:IUser=await UserModel.findOne(({username:username}))
  if(!user){
    res.status(400).json({type:UserErrors.NO_USER_FOUND})
}

// if password is correct
const isPasswordCorrect=await bcrypt.compare(password,user.password)
if(!isPasswordCorrect){
  res.status(400).json({type:UserErrors.WRONG_CREDETIALS})
}

// make jwt token
const token=await jwt.sign({id:user._id},process.env.JWT_SECRET)

res.json({token,userID:user._id})
}

catch(err){
res.status(500).json({type:err})
}
})
router.post('/:id/addAppointment', async (req, res) => {
  const { id } = req.params;
  const { appointmentData } = req.body;

  try {
    // Find the user by userId
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the appointment array in the user document
    user.appointments.push(appointmentData);
    await user.save();

    // Respond with success message
    res.status(200).json({ message: 'Appointment added successfully', user });
  } catch (error) {
    // Handle errors
    console.error('Error adding appointment:', error);
    res.status(500).json({ error: 'Unable to add appointment. Please try again later.' });
  }
});

// creating middleware to verify token

// learn jwt
export const verifyToken=(req:Request,res:Response,next)=>{
  const authHeader= req.headers.authorization
if(authHeader){
jwt.verify(authHeader,process.env.JWT_SECRET,(err)=>{
  if(err){return res.sendStatus(403)}
next();
})

}
else{
res.sendStatus(401)
}
}

export{router as userRouter}