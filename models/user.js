const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    login: String,
    name: String,
    surname:String,
    email:String,
    password:String,
    admin: {
        type: Boolean,
        default: false
    }
  });


const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;