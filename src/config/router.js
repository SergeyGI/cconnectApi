/** @format */

const Router = require('express').Router

const hardware = require('../app/controllers/hardware')
const routes = new Router()

routes.all('*', (req, res, next) => {
  console.log(`Query ${req.url} ${req.method}: `, Date())
  next()
})
/* CRUD Hardware */
routes.param('hardwareId', hardware.load) // ++++
routes.get('/hardware', hardware.list) // ++++
routes.get('/hardware/:hardwareId', hardware.show) // ++++
routes.post('/hardware', hardware.create) // ++++
routes.delete('/hardware/:hardwareId', hardware.destroy)
routes.put('/hardware/:hardwareId', hardware.update)

module.exports = routes
