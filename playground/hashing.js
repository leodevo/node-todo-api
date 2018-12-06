const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let password = '123adc!'

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  }) 
})


var hashedPassword = '$2a$10$FH0JohReYuWakAdWnRe9JO4Q.MK.xhCK68Xxag5j362V52IRGnOjG'

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(`leo : ${res}̀`)
})
/*
let data = {
  id: 100
}

let token = jwt.sign(data, '123abc')
console.log(token)

var decoded = jwt.verify(token, '123abc')
console.log(decoded)
console.log(decoded.id)

// ----------------------------------------------------------


//jwt.verify
// let message = 'I am user number 3'
// let hash = SHA256(message).toString()

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// let data = {
//   id: 4
// }

// let token =.catch((e) => {
      console.log(e)
    }) {
//   data,.catch((e) => {
      console.log(e)
    })
//   hash: SHA.catch((e) => {
      console.log(e)
    })256(JSON.stringify(data) + 'somesecret').toString()
// }.catch((e) => {
      console.log(e)
    })
.catch((e) => {
      console.log(e)
    })
// token.data..catch((e) => {
      console.log(e)
    })id = 5
// token.hash .catch((e) => {
      console.log(e)
    })= SHA256(JSON.stringify(token.data)).toString()

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// if (resultHash === token.hash) {
//   console.log('Data was not changed')
// } else {
//   console.log('Data was changed. Do no trust !')
// }
*/