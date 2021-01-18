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
 */
router.get('/tasks', async (req,res) =>{
    try{
        const tasks = await Task.find({});
        if(!tasks){
           return res.status(404).send();
        }
        res.send(tasks);
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
router.patch('/tasks/:id',async (req, res) =>{
    const {id} = req.params;

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
        const task = await Task.findById(id);

        // error if no task
        if(!task){
           console.log(chalk.red(errorCodes.task.invalidTaskId))
           return res.status(400).send(e)
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


router.delete('/tasks/:id', async (req,res) =>{
    const {id} = req.params;
   try {
        const task = await Task.findByIdAndDelete(id);
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