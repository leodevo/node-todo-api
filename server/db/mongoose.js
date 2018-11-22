var mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('connected to mongoDB service')
}, (err) => {
  console.log(err)
  console.log('Could not connect to DB, make sure a DB application is running')
})

module.exports = { mongoose }
