/** @format */

const express = require('express')
const helmet = require('helmet')

const router = require('./app/router')
const port = 3000
const app = express()

app.listen(port, () => {
  console.log(`API started to port ${port}`)
})

app.use(helmet())
app.use('/', router)
