/** @format */

const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const only = require('only')

const Hardware = mongoose.model('Hardware')

module.exports = {
  load: asyncHandler(async (req, res, next, id) => {
    const err = { status: 404, message: 'Оборудование не найдено' }

    if (!mongoose.isValidObjectId(id)) return next(err)

    req.hardware = await Hardware.load(id)

    if (!req.hardware) return next(err)
    next()
  }),
  /* CREATE */
  create: asyncHandler(async (req, res) => {
    const hardware = new Hardware(
      only(
        req.body,
        'name vendor model ipAddress radiusSecret installationAddress status',
      ),
    )

    const curentHardware = await hardware.save()
    res.status(200).json(curentHardware)
  }),
  /* LIST */
  list: asyncHandler(async (req, res) => {
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
  }),

  show: asyncHandler(async (req, res) => {
    const currentHardware = req.hardware
    res.status(200).json(currentHardware)
  }),

  update: asyncHandler(async (req, res) => {
    const id = req.hardware.id
    const optionsUpdateHardware = {
      new: true,
      useFindAndModify: false,
      runValidators: true,
    }
    const currentHardware = await Hardware.findByIdAndUpdate(
      id,
      only(
        req.body,
        'name vendor model ipAddress radiusSecret installationAddress status',
      ),
      optionsUpdateHardware,
    )

    res.status(200).json(currentHardware)
  }),

  destroy: asyncHandler(async (req, res) => {
    const currentHardware = req.hardware
    await currentHardware.remove()
    res.status(200).json('Destroy')
  }),
}
