const express = require('express')
const chalk = require('chalk');

// adding mongoose so it can load first and setup db connection.
require('./db/mongoose');
const constants = require('./constants/config');

// routes
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task')


//middlewares
const auth = require('./middlewares/auth')

const app = express();
const port = process.env.PORT || constants.expressPort;



// app.use(auth)

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