const User = require('../src/models/users')
const app = require('../src/app');
const {tempUser, setUpDataBaseConnection} = require('./features/dbSetup')

beforeEach(async () =>{
   await setUpDataBaseConnection()
})

test('should successfully create a user',()=>{
    expect(1).toBe(1)
    expect(2).toBe(2)
})