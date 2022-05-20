const {CustomAPIError}=require('../errors')
const { StatusCodes }=require('http-status-codes')

const errorHandlerMiddleware=(err,req,res,next)=>{
    console.log(err.name)
    let customError={
        //set default
        statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message:err.message || 'something went wrong'
    }
    // if(err instanceof CustomAPIError){
    //     return res.status(err.statusCode).json({msg:err.message})
    // }
    if(err.name==='CastError')
    {
        customError.message=`no item found with id:${err.value}`;
        customError.statusCode=404
    }
    if(err.name==='ValidationError')
    {
        customError.message=Object.values(err.errors).map((item)=>item.message).join(', ')
        customError.statusCode=400
    }
    if(err.code && err.code===11000)
    {
        customError.statusCode=400
        customError.message=`duplicate values entered for ${Object.keys(err.keyValue)} , please chose another value`
    }
    // return res.status(customError.statusCode).json(err)

    return res.status(customError.statusCode).json(customError.message)
}
module.exports=errorHandlerMiddleware