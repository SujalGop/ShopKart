import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import customerRoutes from './routes/customer.routes.js'
import productRoutes from './routes/product.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import cors from 'cors'
import wishlistRoutes from './routes/wishlist.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'


const app = express()

const PORT = 8005


mongoose.connect(process.env.dbUrl).then(() => {
    console.log("DB Connected")
}).catch((err) => {
    console.log(err)
})
app.use(cors({
       origin :'http://localhost:5173',
       credentials : true
}))

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
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})