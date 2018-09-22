//const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connected to MongoDB server')
/*
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5b9e13a97f6d709aec65d7a4')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  })*/


  


  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b9ce7cf9ce8bf7ed347007a')
  }, {
    $set: {
      name: "Leo" 
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  })
  //db.close()
})





