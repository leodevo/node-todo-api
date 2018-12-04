var getUser = (id, callback) => {
  var user = {
    id: id,
    name: 'Vikram'
  }
  setTimeout(() => {
    callback(user, 22)
  }, 3000)
}

getUser(31, (user) => {
  console.log(user)
})