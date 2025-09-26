const express=require('express')
const   mongoose  = require('mongoose')
const app=express()
app.use(express.json())
const cors = require("cors");
app.use(cors())
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')

const InitializeDB=async()=>{
    try{
        await mongoose.connect("mongodb+srv://VishnuDev:srxR3fYnjuS0h23e@vishnudev.7g1lbox.mongodb.net/TUS");
        console.log("Moongose Connected Successfully")
            app.listen(2425,()=>{
        console.log("App Is listening In the port number 2425")
    })
        }catch(err){
        console.log("Something Went Wrong")
    }

}
InitializeDB()


const UserSchema = new mongoose.Schema({
  name: String,
  number: Number,
  password: String,
});

const User = mongoose.model("User", UserSchema);

app.post("/signup",async(req,res)=>{
    try{
        const {number,name,password}=req.body
        const hashedPassword=await bcrypt.hash(password,10)
        const userdata={name,password:hashedPassword,number}
        const newUser=new User(userdata)
        await newUser.save()
        
        res.send("User added Successfully")

    }catch(err){
        res.status(400).send("Something went wrong")
    }
    
})

app.post("/signin",async(req,res)=>{
    const {number,password}=req.body
    const query=await User.findOne({number})
    if (!query) {
      return res.status(404).send("User not found");
    } else {
      const hashedPassword=await bcrypt.compare(password,query.password)
      try{
        if(hashedPassword===true){
            const payload={number:number}
            const jwttoken=jwt.sign(payload,"jwttoken");
            console.log("Everything is fine")
            res.send({jwttoken})
        }else{
            alert("Something went Wrong ")
        }
      }catch(err){
        alert("Something is wrong")
      }
    }
})

