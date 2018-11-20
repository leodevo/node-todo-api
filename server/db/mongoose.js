var mongoose = require('mongoose')

mongoose.Promise = global.Promise
//mongoose.connect('mongodb://localhost:27017/TodoApp')

let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://<user>:<password>.mlab.com:<number>/<account>'
};
//|| db.mlab db.localhost ||
mongoose.connect(db.mlab || db.localhost).then(() => {
  console.log('connected to mongoDB service')
}, function(err) {
  console.log(err);
})

module.exports = { mongoose }
