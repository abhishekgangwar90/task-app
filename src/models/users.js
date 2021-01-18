const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const errorCodes = require('../constants/errorCodes');
const jwtUtil = require('../utils/jwt');

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
            authToken:{
                type: String,
                required: true
            }
        }
    ]
})

/**
 * A Virtual field which is not actually stored in db
 *  - but used to set some sort of relationship between two documents
 *  - here i can figure all the tasks create by a certain user. 
 *  - localField is key in current document.
 *  - foreignField is key in the document which we are trying to create a reference for.
 */
userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

/**
 * Creates authentication token and returns it
 */
userSchema.methods.createAuthToken = async function(){
    const user = this;
   
    try {
        //creating token
        const authToken = await jwtUtil.generateJWT({_id : user._id.toString()},'MyPrivateKey', '7 days' )
        
        // saving token in user document, so that this can be identified later
        user.tokens  = user.tokens.concat({authToken});
        await user.save();

        // returning authtoken
        return authToken;
    } catch (error) {
        throw new Error('UnExpected Error')
    }
}


/**
 * Helps in trimming the returnable user response to only public values
 */
userSchema.methods.toJSON = function(){
    const user = this;

    const userObj = user.toObject();

    delete userObj.__v;
    delete userObj.tokens;
    delete userObj.password;

    return userObj;
}

/**
 * Returns the Auth token based on email
 * @param {*} email 
 */
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