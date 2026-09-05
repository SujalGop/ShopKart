import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from './routes/customer.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'


const app = express()

const PORT = 8005

dotenv.config()


mongoose.connect(process.env.dbUrl).then(() => {
    console.log("DB Connected")
}).catch((err) => {
    console.log(err)
})

app.use(express.json())
app.use(cookieParser())
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false
    })
)

app.use('/customers' , customerRoutes)


app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})