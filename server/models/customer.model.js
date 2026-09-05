import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
     },

     email : {
        type : String,
        required : true,
        unique : true
     },
     password : {
        type : String,
        required : true
     },

     phone : {
        type : Number,
        required : true
     }

} , {timestamps : true})


const Customer = mongoose.model('Customer' , customerSchema)

export default Customer