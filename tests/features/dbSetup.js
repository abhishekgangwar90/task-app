const mongoose = require('mongoose');
const chalk = require('chalk');
const jwt = require('jsonwebtoken')

const User = require('../../src/models/users');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-test',{useCreateIndex: true, useNewUrlParser: true}).then((res) =>{
    console.log(chalk.green('Connect to Database'))
}).catch(err =>{
    console.log(chalk.red('Unable to connect to database'))
})


const tempUserId = new mongoose.Types.ObjectId()
const tempUser = {
        name: 'Abhishek Gangwar',
        email: 'Abhishek224@gmail.com',
        password: 'test1234!',
        tokens: [
            {
                authToken:  jwt.sign({_id: tempUserId},'privateKey',{expiresIn: '24 Hours'})
            }
        ]
}


const setUpDataBaseConnection = async () =>{
    await User.deleteMany();
    // await new User(tempUser).save();
}

module.exports = {
    setUpDataBaseConnection,
    tempUser
}