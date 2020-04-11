/** @format */

const express = require('express')
const mongoose = require('mongoose')
const bluebird = require('bluebird')
const fs = require('fs')
const join = require('path').join

const config = require('./config')
const models = join(config.root, 'app/models')
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
  mongoose.Promise = bluebird
  mongoose.connect(config.db, optionsMongo)
  return mongoose.connection
}

connect()
  .once('open', listen)
  .on('error', console.log)
  .on('disconnected', connect)
