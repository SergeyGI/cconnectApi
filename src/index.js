/** @format */

const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const join = require('path').join

const models = join(__dirname, 'app/models')
const config = require('./config')
const app = express()
const optionsMongo = {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(join(models, file)))

require('./config/express')(app)

const listen = () => {
  if (app.get('env') === 'test') return
  app.listen(config.port)
  console.log(`Server running on port ${config.port}`)
}
const connect = () => {
  mongoose.connection
    .once('open', listen)
    .on('error', console.log)
    .on('disconnected', connect)
  return mongoose.connect(config.db, optionsMongo)
}

connect()
