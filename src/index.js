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

app.get('/users', async (req,res) =>{
    try{
        const users = await User.find({});
        if(!users){
           return res.status(404).send();
        }
        res.send(users);
    }catch(e){
        console.log(chalk.red(e))
    }
})


app.get('/users/:id', async (req,res) =>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        if(!user){
            console.log(chalk.red('Unable to find User by given Id'))
           return res.status(404).send('Unable to find User by given Id');
        }
        res.send(user);
    }catch(e){
        console.log(chalk.red(e))
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

app.get('/tasks', async (req,res) =>{
    try{
        const tasks = await Task.find({});
        if(!tasks){
           return res.status(404).send();
        }
        res.send(tasks);
    }catch(e){
        console.log(chalk.red(e))
    }
})

app.get('/tasks/:id', async (req,res) =>{
    try{
        const {id} = req.params;
        const task = await Task.findById(id);
        if(!task){
           return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        console.log(chalk.red(e))
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