const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

//override method :) 
UserSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject() //converts mongoose object to a regular object

  return _.pick(userObject, ['_id', 'email']) // do not return password and token
}

//here defining function with 'function' keyword and not an arrow function because arrow function do not bind 'this'
//but if I define it with the function keyword, if I call this method on a object user, then the keyword this will be bind
// to that object. With an arrow function it could be bind to anything.
UserSchema.methods.generateAuthToken = function () {
  let user = this
  let access = 'auth'
  let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString()

  user.tokens = user.tokens.concat([{ access, token }])

  return user.save().then(() => {
    return token
  })
}

var User = mongoose.model('User', UserSchema) 

module.exports = { User }
