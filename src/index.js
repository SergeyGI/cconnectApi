/** @format */

const express = require('express')

const router = require('./app/router')
const port = 3000
const app = express()

app.listen(port, () => {
  console.log(`API started to port ${port}`)
})

app.use('/', router)
