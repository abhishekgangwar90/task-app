const request = require('supertest');

const User = require('../src/models/users')
const app = require('../src/app');
const {tempUser, setUpDataBaseConnection} = require('./features/dbSetup')

beforeEach(async () =>{
   await setUpDataBaseConnection()
})

test('should successfully create a user',async ()=>{
    const user = await request(app)
    .post('/users/new')
    .send({
        name: 'Abhishek Gangwar',
        email: 'Abhishek1234@gmail.com',
        password: 'Akki!212'
    })
    .expect(201)
})


test('should fail when creating an user with existing Email', async () =>{
        const user1 = new User({
            name: 'Abhishek Gangwar',
            email: 'Abhishek1234@gmail.com',
            password: 'Akki!212'
        }).save();

        await request(app)
            .post('/users/new')
            .send({
        name: 'Abhishek Gangwar',
        email: 'Abhishek1234@gmail.com',
        password: 'Akki!212'
    })
            .expect(400)
})

