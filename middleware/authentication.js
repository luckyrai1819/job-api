const jwt=require('jsonwebtoken')
const { BadRequestError ,UnauthenticatedError} = require('../errors')


const auth=async (req,res,next)=>{
    const authHeader=req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer'))
    {
        throw new BadRequestError('token is not present')
    }
    const token=authHeader.split(' ')[1];
    console.log(token)
    try{
        const payload=await jwt.verify(token,process.env.JWT_SEC)
        req.user={userId:payload.userId,name:payload.name}
        console.log(req.user.userId+' lucky')
        next()
    }catch(err){
        throw new UnauthenticatedError('authentication failed')
    }

}
module.exports=auth