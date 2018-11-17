const {ObjectId} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')

var id = '6bf02c05503fd91d56b9ac1'

if (!ObjectId.isValid(id)) {
  console.log('ID not valid')
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// })

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo)
// })

Todo.findById(id).then((todo) => {

  if (!todo) {
    return console.log('Id not found')
  }
  console.log('Todo By Id', todo)
}).catch((e) => { 
  console.log(e)
})