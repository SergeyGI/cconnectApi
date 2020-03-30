/** @format */

const express = require('express')
const helmet = require('helmet')
const MongoClient = require('mongodb').MongoClient

const optionsMongo = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const client = new MongoClient('mongodb://192.168.99.100:27017', optionsMongo)
const router = require('./app/router')
const port = 3000
const app = express()

app.listen(port, () => {
  client.connect(err => {
    console.log(err ? err : `API started to port ${port}`)
  })
})

app.use(helmet())
app.use('/', router)
