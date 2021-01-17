const express = require('express')
const chalk = require('chalk');

// adding mongoose so it can load first and setup db connection.
const mongoose = require('./db/mongoose')
const constants = require('./constants/config');

const userRouter = require('./routes/user');
const taskRouter = require('./routes/task')


const app = express();

const port = process.env.PORT || constants.expressPort;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


/**
 * Setting up Route handlers
 */

app.listen(port,(err, res) =>{
    if(err){
        console.log(chalk.red(err))
    }
    console.log(chalk.green('Listening on Port '+ port))
})