const {signups} =require('../practisebackend')
const jwt=require("jsonwebtoken")
const userAuth=async(req,res,next)=>{
    const cookies=req.cookies.jwttoken;
    if(cookies===undefined){
        res.status(500).send("Something went Wrong")
    }else{
        const verification=await jwt.verify(cookies,"jwttoken")
        if(verification===undefined){
            res.status(400).send("Something went wrong")
        }
        else{
            const {_id}=verification
            const userdata=await signups.findById({_id:_id})
            req.userdata=userdata
            next()
        }
    }

}


module.exports={
    userAuth
}