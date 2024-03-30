import {Router,Request,Response} from "express"
import { CoachModel } from "../models/coach"
import { verifyToken } from "./user"
import { UserModel } from "../models/user"
import { CoachErrors, UserErrors } from "../error"
import { isCatchClause } from 'typescript';
import bcrypt from "bcrypt";
const router = Router()

router.get("/",async (_,res:Response)=>{
try{
    const coaches = await CoachModel.find({})
res.json({coaches})}
catch(err){

    res.status(400).json({err});
}
})

router.get("/:id",async(req:Request,res:Response)=>{
    const {id}=req.params;
    try{
    const coach= await CoachModel.findById(id)
    if(!coach){
        return res.status(400).json({type:CoachErrors.NO_COACH_FOUND})
    }
    res.json({coach})
}

catch(err){
    res.status(400).json({err})
}

})
router.get("/:id/update-image", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { imageURL } = req.body;

    try {
        const coach = await CoachModel.findById(id);
        if (!coach) {
            return res.status(400).json({ type: CoachErrors.NO_COACH_FOUND });
        }

        coach.imageURL = imageURL;
        await coach.save();

        return res.json({ message: "Image URL updated successfully" });
    } catch (err) {
        res.status(400).json({ err });
    }
});
router.post("/register", async (req: Request, res: Response) => {
    const { name, email, password, calendyLink,imageURL } = req.body;
    
    try {
        // Check if a user with the same name exists
        const existingUserByName = await CoachModel.findOne({ name: name });
        if (existingUserByName) {
            return res.status(400).json({ error: "Coach with this name already exists." });
        }

        // Check if a user with the same email exists
        const existingUserByEmail = await CoachModel.findOne({ email: email });
        if (existingUserByEmail) {
            return res.status(400).json({ error: "Email is already registered." });
        }


        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new CoachModel instance with hashed password
        const newCoach = new CoachModel({
            name: name,
            email: email,
            password: hashedPassword,
            calendyLink: calendyLink,
            imageURL:imageURL
        });

        // Save the new coach to the database
        await newCoach.save();

        // Return success message
        return res.json({ message: "Coach registered successfully" });
    } catch (err) {
        // Log the error
        console.error("Error in registration:", err);

        // Respond with an internal server error
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/remove",async(req:Request,res:Response)=>{
    const {name}=req.body;
    try{
        const coach=await CoachModel.findOneAndDelete({name:name})
        if(!coach){
            return res.status(400).json({type:CoachErrors.NO_COACH_FOUND})
        }
        res.json({message:"Coach removed successfully"})
    }
    catch(err){
        res.status(400).json({err})
    }
})
router.post("/")
// router.post("/checkout",verifyToken,async(req:Request,res:Response)=>{

// // so what i want --> available money of user to go down 
// //purchased item array in user data
// // and i want stockQuantity of that product to go down

// const {customerID,cartItems}=req.body;
// // cartItems will be like thsi{"advs":4//quantity that user wants to buy}
// try{
// const user= await UserModel.findById(customerID);
// const productIDs=Object.keys(cartItems)
// // object.keys is a away to get back list of keys in an object
// const products = await ProductModel.find({_id:{$in:productIDs}});

// if(!user){
//     return res.status(400).json({type:UserErrors.NO_USER_FOUND});
// }
// if(products.length!=productIDs.length){
//     return res.status(400).json({type:ProductErrors.NO_PRODUCT_FOUND});
// } 

// let totalPrice=0;
// for (const item in cartItems){
//     const product = products.find((product) => String(product._id) === item);
//     if(!product){

//     res.status(400).json({type:ProductErrors.NO_PRODUCT_FOUND});

//     }

//     if(product.stockQuantity<cartItems[item]){
//         res.status(400).json({type:ProductErrors.NOT_ENOUGH_STOCK})
//     }

// totalPrice+=product.price*cartItems[item]
// if(totalPrice>user.availableMoney){
// res.status(400).json({type:ProductErrors.No_AVAILABLE_MONEY});
// }
// user.availableMoney-=totalPrice;
// user.purchasedItems.push(...productIDs)
// await user.save()
// // to save changes
// await ProductModel.updateMany({_id:{$in:productIDs}},{$inc:{stockQuantity:-1}})
// res.json({purchasedItems:user.purchasedItems})

// }


// }
// catch(err){
// res.status(400).json(err);

// }
// })


export {router as coachRouter}