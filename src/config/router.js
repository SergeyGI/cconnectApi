/** @format */

const Router = require('express').Router

const hardware = require('../app/controllers/hardware')
const user = require('../app/controllers/user')

const routes = new Router()

routes.all('*', (req, res, next) => {
  console.log(Date(), `Query ${req.url} ${req.method} `)
  next()
})

/* CRUD Hardware */
routes.param('hardwareId', hardware.load)
routes.get('/hardwares', hardware.list)
routes.post('/hardwares', hardware.create)
routes.get('/hardwares/:hardwareId', hardware.show)
routes.put('/hardwares/:hardwareId', hardware.update)
routes.delete('/hardwares/:hardwareId', hardware.destroy)

/* CRUD User */
routes.param('userId', user.load)
routes.get('/users', user.list)
routes.post('/users', user.create)
routes.get('/users/:userId', user.show)
routes.put('/users/:userId', user.update)
routes.delete('/users/:userId', user.destroy)

module.exports = routes
