var mongoose = require('mongoose')

mongoose.Promise = global.Promise

let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: process.env.MONGODB_URI
}

mongoose.connect(db.mlab || db.localhost).then(() => {
  console.log('connected to mongoDB service')
}, (err) => {
  console.log(err)
  console.log('Could not connect to DB, make sure a DB application is running')
})

module.exports = { mongoose }
