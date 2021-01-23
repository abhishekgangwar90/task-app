const mongoose = require('mongoose');
const chalk = require('chalk')

const appConstants = require('../constants/config')

mongoose.connect(appConstants.connectionURL,{useCreateIndex: true, useNewUrlParser: true}).then((res) =>{
    console.log(chalk.green('Connect to Database'))
}).catch(err =>{
    console.log(chalk.red('Unable to connect to database'))
})
