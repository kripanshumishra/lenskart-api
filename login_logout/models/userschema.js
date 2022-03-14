const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:String,
    mobile:Number,
    role:String,
    password:String,
})

const User = mongoose.model('userData',user)
module.exports = User