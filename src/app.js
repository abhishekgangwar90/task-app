const express = require('express')

// adding mongoose so it can load first and setup db connection.
require('./db/mongoose');

// routes
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task')


// middleware
// const auth = require('./middlewares/auth')

const app = express();

// app.use(auth)

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


module.exports = app;