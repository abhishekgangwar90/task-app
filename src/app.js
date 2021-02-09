const express = require('express');
const cors = require('cors');

// routes
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');


// middleware
// const auth = require('./middlewares/auth')

const app = express();
app.use(cors());
// app.use(auth)

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


module.exports = app;