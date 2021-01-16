const express = require('express')
const chalk = require('chalk');

const errorCodes = require('../constants/errorCodes');
const User = require('../models/users');


const router = express.Router()


/**
 * Create a user
 */
router.post('/users',async (req,res) =>{
    const user = new User(req.body);
    try{
        await user.save();
        console.log(chalk.green('User Created Succesfully.'))
        res.status(201).send(user);
    }catch(e){
        console.log(chalk.red(e));
        res.status(400).send(e.message);  
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
 * Get a user by id
 */
router.get('/users/:id', async (req,res) =>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
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

/**
 * Update a user
 */
router.patch('/users/:id',async (req, res) =>{
    const {id} = req.params;

    const requestBody = Object.keys(req.body);
    
   if(requestBody.length ===0){
        console.log(chalk.red(errorCodes.invalidReqError))
        return res.status(400).send(errorCodes.invalidReqError)
    }

    try {
        // without middleware setup
        // const user = await User.findByIdAndUpdate(id, req.body,{new: true, runValidators: true});
        
        // with middleware => setup in models file

        //find a user by id
        const user = await User.findById(id);

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
        res.send(user);

    }catch(e){
        res.status(400).send(e)
    }
})


module.exports = router;