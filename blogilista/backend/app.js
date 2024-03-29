const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const logger = require('./utils/logger')

console.log('connecting to',config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser:true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:',error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)

module.exports = app