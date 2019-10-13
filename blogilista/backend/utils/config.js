require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

// console.log('MONGODB_URI', MONGODB_URI)
// console.log('NODE_ENV', process.env.NODE_ENV)


if(process.env.NODE_ENV === 'test') {
  console.log('test DB in use')
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

if(process.env.NODE_ENV === 'development') {
  console.log('development DB in use')
  MONGODB_URI = process.env.DEV_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT
}