const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const errorCodes = require('../constants/errorCodes');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate:(value)=>{
            if(!validator.isEmail(value)){
                throw new Error(errorCodes.user.invalidEmailError)
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate:(value)=>{
            if(value.length < 8){
                throw new Error(errorCodes.user.shortPasswordError)
            }
        }
    },
    organization: {
        type: String,
        trim: true,
    },
})

userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

module.exports = mongoose.model('User',userSchema)