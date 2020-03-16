const express = require('express')

const router = express.Router()

router.use((req, res, next) => {
    console.log('Time:', Date())
    next()
})

router.get('/', (req, res) => {
    res.send('<h1>Hello API</h1>')
})

router.get('/api', (req, res) => {
    res.send({ api: 'Hello' })
})

module.exports = router
