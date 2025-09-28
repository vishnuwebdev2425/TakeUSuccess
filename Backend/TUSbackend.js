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
const WebSchema=new mongoose.Schema({
  img:String,
  name:String,
  author:String,
  rating:Number,
  link:String

})
const Web=mongoose.model("web",WebSchema);
//add web items API
app.post("/addweb",async(req,res)=>{
  try{
    const newWeb=new Web(req.body)
    res.send(newWeb)
    await newWeb.save()
  }catch(err){
    res.send('Something Went Wrong')
  }
})
const DevopsSchema=new mongoose.Schema({
  img:String,
  title:String,
  rating:Number,
  link:String,
  author:String,
  youtube:String
})
const Devops=mongoose.model("Devops",DevopsSchema)

app.post("/devops",async(req,res)=>{
  try{
    const DevopsItem=new Devops(req.body)
    await DevopsItem.save()
    res.send(DevopsItem)

  }catch(err){
    res.send("Something went Wrong")
  }
  
})

const DSA=new mongoose.Schema({
  img:String,
  title:String,
  rating:Number,
  link:String,
  author:String,
  youtube:String

})

const DSADATA= mongoose.model("DSADATA",DSA)
app.post("/pushdsadata",async(req,res)=>{
  try{
    const newDSA=new DSADATA(req.body)
    await newDSA.save()
    res.send(newDSA)

  }catch(err){
    res.send("Something Went Wrong")
  }
  
})
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
      return res.status(404).json({ error: "User not found" });

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

app.get("/web",async(req,res)=>{
  try{
    const query=await Web.find({})
    res.send(query)

  }catch(err){
    res.status(500).send("Something Went Wrong")
  }

})

app.get("/devops",async(req,res)=>{
  try{
    const devopsData=await Devops.find({})
    res.send(devopsData)
  }catch(err){
    res.status(400).send("Something Went Wrong")
  }
})

app.get("/dsadata",async(req,res)=>{
  try{
    const dsadata=await DSADATA.find({})
    res.send(dsadata)

  }catch(err){
    res.status(500).send("Something went wrog")
  }
})
const PractiseSchema=new mongoose.Schema({
  firstname:{
    type:String,
    required:true,
    unique:true

  },
  lastname:{
    type:String

  },
  age:{
    type:Number,
    min:18,
    max:60,
    required:true
    
  },
  password:{
    type:String,
    required:true,
    unique:true
  
  },
  gender:{
    type:String,
    required:true,
    validate(value){
      if(!["male","female","others"].includes( value)){
        throw new Error("Unexpected Behaviour")

      }
    }
  }
},{
  timestamps:true
})
const Practise=mongoose.model("Practise",PractiseSchema);
app.post("/addpractise",async(req,res)=>{
  try{
    const Practisedata=new Practise(req.body)
    await Practisedata.save()
    res.send(Practisedata)

  }catch(err){
    res.status(500).send("Something went wrong"+err.message)
  }
  
})
app.patch("/patchpractise", async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    const updatedData = await Practise.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true, // return updated document
        runValidators: true, // ✅ enforce schema validation
      }
    );

    if (!updatedData) {
      return res.status(404).send("Document not found");
    }

    res.send(updatedData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.patch("/practisepatch",async(req,res)=>{
  const data=req.body
  const values=[
    "firstname","lastname","password"
  ]
 try{
   const checkedresult=Object.keys(data).every((k)=>values.includes(k))
   if(checkedresult){
    res.send('Everything will executed is successfully')
   }else{
    res.send("Something went wrong")
   }
 }catch(err){
  res.send(err.message)
 }
})