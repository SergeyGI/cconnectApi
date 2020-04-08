/** @format */

const mongoose = require('mongoose')
const only = require('only')

const Hardware = mongoose.model('Hardware')

module.exports = {
  load: async (req, res, next, id) => {
    try {
      const error = new Error('Оборудование не найдено')
      if (!mongoose.isValidObjectId(id)) return next(error)
      req.hardware = await Hardware.load(id)
      if (!req.hardware) return next(error)
    } catch (err) {
      return next(err)
    }
    next()
  },

  create: async (req, res) => {
    try {
      const hardware = new Hardware(
        only(
          req.body,
          'name vendor model ipAddress radiusSecret installationAddress status',
        ),
      )
      await hardware.save()
      res.sendStatus(200)
    } catch {
      res.sendStatus(422)
    }
  },

  list: async (req, res) => {
    try {
      const page = (req.query.page > 0 ? req.query.page : 1) - 1
      const limit = req.query.limit > 0 ? req.query.limit : 15
      const _id = req.query.item
      const options = { limit, page }

      if (_id) options.criteria = { _id }

      const hardwares = await Hardware.list(options)
      const count = await Hardware.countDocuments()

      res.status(200).json({
        hardwares,
        page: page + 1,
        pages: Math.ceil(count / limit),
        count,
      })
    } catch {
      res.sendStatus(422)
    }
  },

  show: async (req, res) => {
    try {
      res.status(200).json(req.hardware)
    } catch {
      res.sendStatus(422)
    }
  },

  update: async (req, res) => {
    try {
      const _id = req.hardware._id
      const optionsUpdateHardware = { new: true, useFindAndModify: false }
      console.log(111)
      const currentHardware = await Hardware.findByIdAndUpdate(
        { _id },
        only(
          req.body,
          'name vendor model ipAddress radiusSecret installationAddress status',
        ),
        optionsUpdateHardware,
      )

      console.log(222)
      res.status(200).json(currentHardware)
    } catch {
      res.sendStatus(422)
    }
  },

  destroy: async (req, res) => {
    const ref = req.headers.referer
    await req.hardware.remove()
    req.flash('warning', `Оборудование ${req.hardware.name} удалено`)
    if (ref) res.redirect(ref)
    else res.redirect('/hardwares')
  },
}
