const express=require('express')
const app=express()
const mongoose=require('mongoose')
let validator = require("validator");
const bcrypt = require("bcrypt");
const cookieparser=require('cookie-parser')
const { validatingfunction}=require("./util/validationfunction")
app.use(express.json());
app.use(cookieparser());
const  { userAuth } =require('./middleware/Auth');
const jwtToken=require('jsonwebtoken')
const IntializeDb=async()=>{
    try{
        await mongoose.connect("mongodb+srv://VishnuDev:srxR3fYnjuS0h23e@vishnudev.7g1lbox.mongodb.net/TUS");
        console.log("Mongoose Connected Successfully");
        app.listen(2525,()=>{
            console.log("App is listening on the server 2525")
        })

    }catch(err){
        console.log(err.message)
    }
}
IntializeDb()
const LoginSchema=new mongoose.Schema({
    firstname:{
        type:String,
        minlength:5,
        required:true,
        maxlength:50,
        trim:true
    },
    lastname:{
        type:String,
        trim:true
    },
    age:{
        type:Number,
        required:true,
        min:18,
        max:50,
        validate(value){
            if(value <17){
                throw new Error(" Age Limit is Must Satisfy")

            }
        }
    },
    gender:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            const checking=["male","female","others"]
            if(!checking.includes(value)){
                throw new Error("Invalid Gender Details")
            }

        }

    },
    about:{
        type:String,
        default:"Im a Student"
    },
    email:{
        required:true,
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address")
            }
        },
        lowercase:true,
        maxlength:20,
        minlength:5
        
    }

},{
    timestamps:true
})
const UserLogin=mongoose.model("UserLogin",LoginSchema);
app.post("/login",async(req,res)=>{
    try{
        const requiredfields=[
        "firstname","lastname","age","gender","about","email"
        ]
        const data=req.body
       const result = requiredfields.every((field) =>
         Object.keys(data).includes(field)
       );

         if(result){
            const newUser=new UserLogin(data)
            await newUser.save()
            res.status(200).send("User Registered Successfully")
         }else{
            res.status(400).send("Fields Mismatched")
         }

    }catch(err){
        res.status(500).send("Something went wrong")

    }  
})

const signup=new mongoose.Schema({
    firstname:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        minlength:5
    },
    email:{
        type:String,
        unique:true,
        minlength:5,
        maxlengt:20,
        lowercase:true
    },
    password:{
        type:String,
        maxlength:60,
        validate(value){
            if(value.lenth<5){
                throw new Error("Something went Wrong")
            }
        }
    }
})
const signups=mongoose.model("signups",signup)
app.post("/newuser",async(req,res)=>{
    try{
        const {firstname,lastname,email,password}=req.body
    validatingfunction(req)
  
    const hashedPassword=await bcrypt.hash(password,10)
    const newusers={
        firstname,lastname,email,password:hashedPassword
    }
    const newUser=new signups(newusers)
    await newUser.save()
    res.send(newUser)


    }catch(err){
        res.send("ERROR  "+err.message)
    }
    
})

app.post("/verify",async(req,res)=>{
     try {
       const { email, password } = req.body;
       const response = await signups.findOne({ email: email });
       if (response === undefined) {
         res.status(400).send("InvalidCrendentials");
       } else {
         const hashedPassword = await bcrypt.compare(
           password,
           response.password
         );
         if (hashedPassword === true) {
           const payload = { _id: response._id };
           const jwtTokens = await jwtToken.sign(payload, "jwttoken");
           res.cookie("jwttoken",jwtTokens , {
             expires: new Date(Date.now() + 900000),
             
           });
           res.send("Everything workds fine")
         } else {
           res.send("invalid Credentials");
         }
       }
     } catch (err) {
       res.status(500).send("Invalid Crendentials");
     }

   
})
app.get("/details", async(req, res) => {
  console.log("Cookies from request:", req.cookies); // 👈 debug

  const value=req.cookies.jwttoken

  const decodeddata=await jwtToken.verify(value,"jwttoken")
  if(decodeddata){
    const {_id}=decodeddata
    const responsedata=await signups.findById({_id:_id})
    res.send(responsedata)
  }else{
    res.send("Something went wrong")
  }
});
app.get("/getprofile",userAuth,async(req,res)=>{
    try{
        const userdata=req.userdata
        res.send(userdata)
    }catch(err){
        res.status(500).send("Something went wrong")

    }
})

module.exports = { signups };