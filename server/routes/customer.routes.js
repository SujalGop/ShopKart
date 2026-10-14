import express from 'express'
import { getCustomer, loginCustomer, registerCustomer, logoutCustomer } from '../controllers/customer.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'



const customerRoutes = express.Router()


customerRoutes.post('/register' , registerCustomer)

customerRoutes.post('/login' , loginCustomer)

customerRoutes.get('/me' , isAuthenticated , getCustomer)

customerRoutes.post('/logout' , logoutCustomer)







export default customerRoutes