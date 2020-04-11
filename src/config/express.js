/** @format */

const helmet = require('helmet')
const bodyParser = require('body-parser')

const router = require('./router')
const handlingErrors = require('./middlewares/handlingErrors')

module.exports = app => {
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use('/', router)
  app.use(...handlingErrors)
}
