/** @format */

const Router = require('express').Router

const hardware = require('../app/controllers/hardware')
const routes = new Router()

routes.all('*', (req, res, next) => {
  console.log(`Query ${req.url} ${req.method}: `, Date())
  next()
})
/* CRUD Hardware */
routes.param('hardwareId', hardware.load)
routes.get('/hardwares', hardware.list)
routes.post('/hardwares', hardware.create)
routes.get('/hardwares/:hardwareId', hardware.show)
routes.put('/hardwares/:hardwareId', hardware.update)
routes.delete('/hardwares/:hardwareId', hardware.destroy)

module.exports = routes
