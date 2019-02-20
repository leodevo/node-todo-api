var mongoose = require('mongoose')

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: false
  },
  _creator: { //Object ID of the creator of the todo
    type: mongoose.Schema.Types.ObjectId,
    required:true
  } 
})

module.exports = { Todo }
