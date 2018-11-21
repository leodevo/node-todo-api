var mongoose = require('mongoose')

mongoose.Promise = global.Promise

let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: MONGODB_URI
}

mongoose.connect(db.mlab || db.localhost).then(() => {
  console.log('connected to mongoDB service')
}, (err) => {
  console.log(err)
})

module.exports = { mongoose }
