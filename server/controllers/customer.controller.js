import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import { genToken } from "../utils/generateToken.js"

// Register Controller

const cookiesOptions = {
    httpOnly: true,
    secure: false
}

export const registerCustomer = async (req, res) => {
    try {
        const { fullname, email, password, phone } = req.body
        // all fileds present 
        // if the email or username already exists
        // password should be greater tha 6 characters

        if (!fullname || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields Required" })
        }


        if (password.length < 6) {
            return res.status(400).json({ message: "Password Length should be at least 6" })
        }

        const phoneExists = await Customer.findOne({ phone })

        if (phoneExists) {
            return res.status(409).json({ message: "Phone Number Already Exists" })
        }

        const emailExists = await Customer.findOne({ email })

        if (emailExists) {
            return res.status(409).json({ message: "Email Already Exists" })
        }


        // Password Security

        const salt = await bcrypt.genSalt(10)


        const hashedPassword = await bcrypt.hash(password, salt)




        const newCustomer = await Customer.create({
            fullname,
            phone,
            email,
            password: hashedPassword
        })

        // newUser._id

        // token  - jwt  - access token 

        const token = genToken(newCustomer._id)

        res.cookie("token", token, cookiesOptions)

        res.status(201).json({ message: "Customer Resgitered", customer: newCustomer })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body

        const customer = await Customer.findOne({ email })

        if (!customer) {
            return res.status(404).json({
                message: "Customer Not Found Please Register"
            })
        }

        const passwordCheck = await bcrypt.compare(
            password,
            customer.password
        )

        if (!passwordCheck) {
            return res.status(400).json({
                message: "Wrong Password"
            })
        }

        const token = genToken(customer._id)

        res.cookie("token", token, cookiesOptions)

        res.status(200).json({
            message: "Customer Logged IN"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        })
    }
}




export const getCustomer = async (req, res) => {
    res.status(200).json({ message: "Customer Authenticated", customerData: req.customer })
}

export const logoutCustomer = async (req, res) => {
    res.clearCookie("token", cookiesOptions)

    return res.status(200).json({
        message: "Logged out successfully"
    })
}