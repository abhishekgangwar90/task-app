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
    const response = await request(app)
    .post('/users/new')
    .send(userReqData)
    .expect(201)

    const user = await User.findById(response.body.user._id);
    expect(user._id).not.toBeUndefined()
})


test('should fail when creating an user with existing Email', async () =>{
        await request(app)
            .post('/users/new')
            .send({
                name: 'Abhishek Gangwar',
                email:'Abhishek123@gmail.com',
                password: 'test1234!'
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


// test('should be able to logout', async () =>{
//     await request(app)
//         .post('/users/logout')
//         .set('Authorization', `Bearer ${tempUser.tokens[0].authToken}`)
//         .send()
//         .expect(200)
// })

test('should be able to show all users', async () =>{
    await request(app)
        .post('/users')
        .send()
        .expect(200)
});
