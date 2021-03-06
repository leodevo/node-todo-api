const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

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

// override method
UserSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()
  /*
    toOjbect() takes the mongoose object, and converts it into a regular object where only the
    properties available on the the document exist.
    To sum up it converts this document into a plain javascript object, ready for storage in MongoDB.
  */

  return _.pick(userObject, ['_id', 'email']) // do not return password and token
}

// Here we define function with 'function' keyword and not an arrow function because arrow functions do not bind 'this'
// but if I define it with the function keyword, if I call this method on a object user, then the keyword this will
// be bound to that object.
// With an arrow function it could be bound to anything.
UserSchema.methods.generateAuthToken = function () {
  let user = this // instance method get called with the individual document as the 'this' binding
  let access = 'auth'
  let token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString()

  user.tokens = user.tokens.concat([{ access, token }])

  return user.save().then(() => {
    return token
  })
}

UserSchema.methods.removeToken = function (token) {
  var user = this

  return user.update({
    $pull: {
      tokens: { token }
    }
  })
}

// Model methods != instance methods
// User : model methods
// user : user methods

// 'statics' keyword equivalent to 'methods' keyword BUT
// 'statics' ==> model method
// 'methods' ==> instance method
UserSchema.statics.findByToken = function (token) {
  let User = this // model methods gets called with the model as the 'this' binding
  let decoded
  // First step is to verify token authenticity

  // jwt.verify() will throw if verification fails (token value manipulated or secret salt wrong)
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    /*
    return new Promise((resolve, reject) => {
      reject()
    })
      // Instead of returning a Promise that rejects right away, we can return 'Promise.reject()'
    */
    return Promise.reject(e)
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token, // quotes needed when nested object
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this

  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject()
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res === true) {
          resolve(user)
        } else {
          reject()
        }
      })
    })
  })
}

/*
  This is a middleware that gets called before a save event.
  Here we want to hash the password before it is saved.
  However we check if the user password has been modified ('user.isModifier('password')')
  Because let's say the user has only changed the email without touching the password,
  then we will rehash the hashed password ! Which is not what we want. Therefore we
  check if the password has been modified before hashing it.
*/

UserSchema.pre('save', function (next) {
  let user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

var User = mongoose.model('User', UserSchema)

module.exports = { User }
