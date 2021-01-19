const express = require('express')
const chalk = require('chalk');

const errorCodes = require('../constants/errorCodes');
const auth = require('../middlewares/auth');
const Task = require('../models/tasks');


const router = express.Router()



/**
 * Create a task
 */
router.post('/tasks',auth,(req, res) =>{
     if(req){
        const  taskData = {
            ...req.body,
            createdBy: req.user._id
        }
        const task = new Task(taskData)
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
 * get all tasks
 * 
 * - Get all completed Tasks => /tasks?completed=true
 * - Get all incompleted Tasks => /tasks?completed=false
 * - Sort Tasks based on creadtedDate desc order -> /tasks?sortBy=createdAt:desc
 */
router.get('/tasks',auth, async (req,res) =>{

    const {completed, limit, offset, sortBy} = req.query

    const match= {};
    const sort = {};

    if(completed === 'true'){
        match.completed = true
    } else if(completed === 'false'){
        match.completed = false
    }

    if(sortBy){
        const sortData = sortBy.split(':');
        sort[sortData[0]] = sortData[1] === 'desc' ? -1 : 1;
    }

    try{
        // one way of doing
        // const tasks = await Task.find({createdBy: req.user._id});

        // another way - by taking advantage of virtuals(check the models)
        // this will fetch the all tasks and set it in virtual -> "tasks" in user model
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
               limit: parseInt(limit),
               skip: parseInt(offset),
               sort
            }
        }).execPopulate();

        if(!req.user.tasks){
           return res.status(404).send([]);
        }
        res.send(req.user.tasks);
    }catch(e){
        console.log(chalk.red(e))
        res.status(500).send(e)
    }
})

/**
 * Get a task by id
 */
router.get('/tasks/:id',auth, async (req,res) =>{
    try{
        const {id} = req.params;
        const task = await Task.findOne({_id:id, createdBy: req.user._id});
        if(!task){
           console.log(chalk.red(errorCodes.task.invalidTaskIdError))
           return res.status(404).send(errorCodes.task.invalidTaskIdError);
        }
        res.send(task);
    }catch(e){
        console.log(chalk.red(e))
        res.status(500).send(e)
    }
})


/**
 * Update a Task
 */
router.patch('/tasks/:id',auth,async (req, res) =>{

    const {user, params} = req;
    const {id} = params;

    const requestBody = Object.keys(req.body);
    const allowedKeys = ['title', 'description','isComplete','status','createDate']

    if(requestBody.length ===0){
        console.log(chalk.red(errorCodes.invalidReqError))
        return res.status(400).send(errorCodes.invalidReqError)
    }

    if(!requestBody.every(elm => allowedKeys.indexOf(elm) !== -1)){
        console.log(chalk.red('Invalid key found'));
        return res.status(400).send(errorCodes.invalidReqError)
    }

    try {
        // without middleware
        // const task = await Task.findByIdAndUpdate(id, req.body,{new: true, runValidators: true});

        //with middleware  => setup in models file

        //find the task by id
        const task = await Task.findOne({_id: id, createdBy: user._id});

        // error if no task
        if(!task){
           console.log(chalk.red(errorCodes.task.invalidTaskIdError))
           return res.status(400).send(errorCodes.task.invalidTaskIdError)
        }

        // if task is there then update new values
        requestBody.forEach(key =>{
            task[key] = req.body[key]
        })

        // save the document
        await task.save()
        res.send(task);

    } catch (e) {
        console.log(chalk.red(e))
        res.status(400).send(e)
    }
})


router.delete('/tasks/:id',auth, async (req,res) =>{
    const {user, params} = req;
    const {_id}  = user;
    const {id} = params;

   try {
        const task = await Task.findOneAndRemove({_id: id, createdBy: _id});
        if(!task){
            console.log(chalk.red(errorCodes.task.invalidTaskIdError));
            return res.status(400).send(errorCodes.task.invalidTaskIdError)
        }
        res.send(task)
   } catch (error) {
       console.log(chalk.red(error));
       res.status(500).send(error)
   }
})

module.exports = router;