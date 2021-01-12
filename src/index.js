const express = require('express')
const chalk = require('chalk');

const constants = require('./constants/config');
const mongoose = require('./db/mongoose');
const User = require('./models/users');
const Task = require('./models/tasks');
const tasks = require('./models/tasks');


const app = express();

const port = process.env.PORT || constants.expressPort;

app.use(express.json())


app.post('/users',(req,res) =>{

    if(req){
        const user = new User(req.body)
        user.save().then(() =>{
            console.log(chalk.green('User Created Succesfully.'))
            res.status(201).send(user)
        }).catch((e) =>{
            res.status(400).send(e.message)
            console.log(chalk.red(e))
        })
        
    }
})

app.post('/tasks',(req, res) =>{
     if(req){
        const task = new Task(req.body)
        task.save().then(() =>{
            console.log(chalk.green('Task Created Succesfully.'))
            res.status(201).send(task)
        }).catch((e) =>{
            res.status(400).send(e.message)
            console.log(chalk.red(e))
        })
    }
})

/**
 * Setting up Route handlers
 */

app.listen(port,(err, res) =>{
    if(err){
        console.log(chalk.red(err))
    }
    console.log(chalk.green('Listening on Port '+ port))
})