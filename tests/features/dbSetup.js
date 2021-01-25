const User = require('../../src/models/users');

const tempUser = {
        name: 'Abhishek Gangwar',
        email: 'Abhishek123@gmail.com',
        password: 'test1234!'
}

const setUpDataBaseConnection = async () =>{
    await User.deleteMany()
    await new User(tempUser).save();
}

module.exports = {
    setUpDataBaseConnection,
    tempUser
}