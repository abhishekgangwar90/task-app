// const mongodb = require('mongodb');
// const config = require('./src/constants/constants');

// const mongoClient = mongodb.MongoClient;

// const dbName = 'task-app';

// mongoClient.connect(config.connectionURL, {useNewUrlParser: true}, (err, client) =>{
//     if(err){
//         return console.log('Unable to connect to mongoDb, Please try again!!')
//     }

//     const db = client.db(dbName);

//     db.collection('user-list').insertMany([{name:'Arvind', age: 26},{name: 'Ravi' , age: 29}])

//     // db.collection('user-list').updateOne({_id: new mongodb.ObjectID('5ff8b119b34a747029886dc0')},{
//     //     $set: {
//     //         name: 'Abhishek Gangwar'
//     //     }
//     // }).then((res) =>{
//     //     console.log('done')
//     // })
// })
