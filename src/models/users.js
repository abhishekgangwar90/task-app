const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        unique: true,
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
    tokens:[
        {
            type: String,
            required: true
        }
    ]
})


// userSchema.method.saveAuthToken = async function(token){
//     const user = this;
//     user.tokens.token
// }

userSchema.methods.createAuthToken = async function(){
    const user = this;
    const authToken = await jwt.sign({id : user.id}, 'MyPrivateKey', {expiresIn:'7 days'})
    return authToken;
}

userSchema.methods.getAuthToken = function(email,){
    const user = this;
}


/**
 * Returns user/error based on provided email.
 * @param {*} email 
 */
userSchema.statics.findByEmail = async (email) => {
    try{
        const user = await User.findOne({email})
        if(!user){
            return null
        }
        return user;
    }catch(e){
        throw new Error('UnExpected Error');
    }
}


/**
 * Returns User/error based on Provided email and password. 
 * @param {*} email 
 * @param {*} password 
 */
userSchema.statics.findByCredentials = async (email, password) =>{
   try {
        const userByEmail = await User.findByEmail(email);

        if(!userByEmail){
            return null;
        }

        const isMatch = await bcrypt.compare(password, userByEmail.password)
        // comparing both passwords
        if(!isMatch){
            return null;
        }

        return userByEmail;

   } catch (error) {
       throw new Error('UnExpected Error')
   }
}


userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User',userSchema);

module.exports = User;