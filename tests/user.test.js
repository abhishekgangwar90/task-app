const request = require('supertest');

const User = require('../src/models/users')
const app = require('../src/app');
const {tempUser, setUpDataBaseConnection} = require('./features/dbSetup')

beforeEach(async () =>{
   await setUpDataBaseConnection()
})

const userReqData = {
    name: 'Rachel Green',
    email: 'Rachel123@gmail.com',
    password: 'Rachel1234'
}

test('should successfully create a user',async ()=>{
    await request(app)
    .post('/users/new')
    .send(userReqData)
    .expect(201)

})


test('should fail when creating an user with existing Email', async () =>{
        await request(app)
            .post('/users/new')
            .send({
                name: 'Abhishek Gangwar',
                email:'Abhishek123@gmail.com',
                password: 'Abkii@123'
            })
            .expect(400)
})


test('should be able to login', async () =>{
    await request(app)
        .post('/users/login')
        .send({
            email: 'Abhishek123@gmail.com',
            password: 'test1234!'
        }).expect(200)
})
