const Job = require('../models/Job')
const { statusCodes, StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError, } = require('../errors')



const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('company')
    res.status(StatusCodes.OK).json({ jobs, user: req.user.name, count: jobs.length })
}
const getJob = async (req, res) => {
    const { user: { userId, name }, params: { id: jobId } } = req
    const job = await Job.findOne({ _id: jobId, createdBy: userId })
    if (!job)
        throw new NotFoundError('job not found')
    res.status(StatusCodes.OK).json({ job, user: name })
}
const createJob = async (req, res) => {
    console.log(req.user.userId)
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json(job)
}
const updateJob = async (req, res) => {
    const{
        body:{company,position},
        params:{id:jobId},
        user:{userId}
    }=req
    console.log(company);
    if(company===''|| position==='')
    throw new BadRequestError("company and position can't be empty")

    const job=await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true})
    if(!job)
    throw new NotFoundError(`no jobs with id: ${jobId}`)

    res.status(StatusCodes.OK).json(job)
}
const deleteJob = async (req, res) => {
    const{
        params:{id:jobId},
        user:{userId}
    }=req
    const job=await Job.findByIdAndDelete({_id:jobId,createdBy:userId})

    if(!job)
    throw new NotFoundError(`no jobs with id: ${jobId}`)

    res.status(StatusCodes.OK).json(job)
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }