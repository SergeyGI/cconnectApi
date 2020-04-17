/** @format */

const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const only = require('only')

const User = mongoose.model('User')

const login = (req, res) => {
  const redirectTo = req.session.returnTo ? req.session.returnTo : '/'
  delete req.session.returnTo
  res.redirect(redirectTo)
}

module.exports = {
  /* LOAD TO ID */
  load: asyncHandler(async (req, res, next, id) => {
    const err = { status: 404, message: 'Пользователь не найдено' }
    if (!mongoose.isValidObjectId(id)) return next(err)

    req.user = await User.load(id)
    if (!req.user) return next(err)
    next()
  }),

  /*CREATE*/
  create: asyncHandler(async (req, res, next) => {
    const user = new User(only(req.body, 'name email password'))
    const currentUser = await user.save()

    res.status(200).json(currentUser)
  }),

  /* LIST */
  list: asyncHandler(async (req, res) => {
    const page = (req.query.page > 0 ? Number(req.query.page) : 1) - 1
    const limit = req.query.limit > 0 ? Number(req.query.limit) : 15
    const _id = req.query.item
    const options = { limit, page }

    if (_id) options.criteria = { _id }

    const users = await User.list(options)
    const count = await User.countDocuments()

    res.status(200).json({
      users,
      page: page + 1,
      pages: Math.ceil(count / limit),
    })
  }),

  /* SHOW */
  show: asyncHandler(async (req, res) => {
    const currentUser = req.user
    res.status(200).json(currentUser)
  }),

  /* UPDATE */
  update: asyncHandler(async (req, res) => {
    const id = req.user.id
    const optionsUpdateUser = {
      new: true,
      useFindAndModify: false,
      runValidators: true,
    }
    const currentUser = await User.findByIdAndUpdate(
      id,
      only(req.body, 'name email password'),
      optionsUpdateUser,
    )

    res.status(200).json(currentUser)
  }),

  /* DESTROY */
  destroy: asyncHandler(async (req, res) => {
    const currentUser = req.user
    await currentUser.remove()
    res.status(200).json('Destroy')
  }),
}
