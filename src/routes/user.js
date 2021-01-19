const express = require('express')
const chalk = require('chalk');
const multer = require('multer')

const errorCodes = require('../constants/errorCodes');
const User = require('../models/users');
const auth = require('../middlewares/auth');


const router = express.Router()


/**
 * Create a user
 */
router.post('/users/new',async (req,res) =>{
    const user = new User(req.body);
    try{
        await user.save();

        const authToken = await user.createAuthToken();

        console.log(chalk.green('User Created Succesfully.'))
        res.status(201).send({user,authToken});
    }catch(e){
        console.log(chalk.red(e));
        res.status(400).send(e);  
    }
})


/**
 * Login user
 */
router.post('/users/login',async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(400).send(errorCodes.invalidReqError)
    }

    const {email, password} = req.body;

    try{
        const user = await User.findByCredentials(email, password);

        if(!user){
            console.log(chalk.red(errorCodes.user.inValidLoginCreds));
            return res.status(404).send(errorCodes.user.inValidLoginCreds);
        }

        const authToken = await user.createAuthToken();
        res.send({user,authToken});

    }catch(e){
        res.status(400).send(e)
    }
})

/**
 * Logout user
 */
router.post('/users/logout', auth, async (req, res) =>{
   try {
        req.user.tokens = req.user.tokens.filter(elm=> elm.authToken !== req.token)

        await req.user.save();
        return res.send(req.user);

   } catch (error) {
       console.log(chalk.red('Logout - Something went wrong.'))
       res.status(500).send()
   }
})

/**
 * Get all users
 */
router.get('/users', async (req,res) =>{
    try{
        const users = await User.find({});
        if(!users){
           return res.status(404).send();
        }
        res.send(users);
    }catch(e){
        console.log(chalk.red(e));
        res.status(500).send(e);
    }
})


/**
 * Get a users profile by authtoken
 */
router.get('/users/profile',auth, async (req,res) =>{
    try{
        const {user} = req;
        if(!user){
           console.log(chalk.red(errorCodes.user.invalidUserIdError))
           return res.status(404).send(errorCodes.user.invalidUserIdError);
        }
        res.send(user);
    }catch(e){
        console.log(chalk.red(e))
        res.status(500).send(e)
    }
})



// const multer = multer.

/**
 * Upload profile pic for a user
 */
router.post('/users/profile/upload', async(req, res, next) =>{

})

/**
 * Update a user
 */
router.patch('/users/update',auth,async (req, res) =>{
    
    // user details coming from auth
    const {user} = req;

    const requestBody = Object.keys(req.body);
    
   if(requestBody.length ===0){
        console.log(chalk.red(errorCodes.invalidReqError))
        return res.status(400).send(errorCodes.invalidReqError)
    }

    try {
        // we don't need to find user anymore because user details are coming from auth middleware
        {
            // without middleware setup
            // const user = await User.findByIdAndUpdate(id, req.body,{new: true, runValidators: true});
            
            // with middleware => setup in models file

            // find a user by id
            // const user = await User.findById(id);
        }

        //if no user then send back error
        if(!user){
            console.log(chalk.red(errorCodes.user.invalidUserIdError))
            return res.status(400).send(e)
        }

        // else setting up update the value for each key;
        Object.keys(req.body).forEach(key =>{
            user[key] = req.body[key]
        })
        //save the document and send back the updated user
        await user.save();
        res.send(user);
        
    } catch (e) {
        console.log(chalk.red(e))
        res.status(400).send(e)
    }
})


/**
 * Delete A User
 */
router.delete('/users/:id', async (req,res) =>{
    const {id} = req.params;
   try {
        const user = await User.findByIdAndDelete(id);
        if(!user){
            console.log(chalk.red(errorCodes.user.invalidUserIdError));
            return res.status(400).send(errorCodes.user.invalidUserIdError)
        }
        res.send(user)
   } catch (error) {
       console.log(chalk.red(error));
       res.status(500).send(error)
   }
})







module.exports = router;