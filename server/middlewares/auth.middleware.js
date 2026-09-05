import jwt from 'jsonwebtoken'
import Customer from '../models/customer.model.js'

export const isAuthenticated = async (req , res , next)=>{
    const token =  req.cookies.token

    if(!token){
        res.status(401).json({message:"Not Authorized"})
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET)

    const customer =  await Customer.findById(decoded.customerId)

    if(!customer){
        res.status(404).json({message:"User Not Found Token Invalid"})
    }

    req.customer = customer

    next()
}