const express = require('express')

const router = require('./router')
const port = 3000
const app = express()

app.listen(port)

app.use('/', router)
