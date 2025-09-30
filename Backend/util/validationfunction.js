let validator = require("email-validator");
const { isStrongPassword } = require("validator");
const validatingfunction=(req)=>{
    const {firstname,lastname,email,password}=req.body
    if(!firstname){
        throw new Error("Invalid Crenditals")
    }else if(!lastname){
        throw new Error("Invalid Crendentials")
    }else if(!validator.validate(email)){
            throw new Error("Invalid User details")
        }
    else{
        if(password.length<5){
            throw new Error("Weak Password Is Occured")
        }

    }

}

module.exports={
    validatingfunction
}