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
  let user = this // instance method get called with the individual document as the 'this' binding
  let access = 'auth'
  let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString()

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

//'statics' keyword équivalent de 'methods' mais tout ce qui tu definis dans statics le rend comme une model method
// dans methods, ça le rend comme une instance method
UserSchema.statics.findByToken = function (token) {
  let User = this // model methods gets called with the model as the 'this' binding
  let decoded

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {
    return Promise.reject()
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
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
