const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'must provide name'],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true,'must provide email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'must provide valid email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'must provide password'],
        minlength:6,
    }
})

UserSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
    next()
})
UserSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SEC,{expiresIn:'30d'})
}
UserSchema.methods.comparePassword=async function(InputPassword){
    const isMatch=await bcrypt.compare(InputPassword,this.password)
    console.log(isMatch)
    return isMatch
}
module.exports=mongoose.model('User',UserSchema)