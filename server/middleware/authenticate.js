const { User } = require('./../models/user')

let authenticate = (req, res, next) => {
  let token = req.header('x-auth')

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject()
      // will catch an error and then go to code a few line below and send a 401
      // We also could have thrown an error here, the result would have been the same
    }

    req.user = user
    req.token = token
    next()
  }).catch((e) => {
    res.status(401).send()
  })
}

module.exports = { authenticate }
