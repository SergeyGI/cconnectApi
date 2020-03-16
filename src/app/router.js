/** @format */

const express = require('express')

const router = express.Router()

router.all('*', (req, res, next) => {
  console.log(`Query ${req.url} ${req.method}: `, Date())
  next()
})

router.get('/', (req, res) => {
  res.send('<h1>Start APP</h1>')
})

router.get('/api', (req, res) => {
  res.send({ api: 'API' })
})

router.get('/text', (req, res) => {
  res.download('./file/123.txt')
})

router.use((req, res) => {
  res.status(404)
})

module.exports = router
