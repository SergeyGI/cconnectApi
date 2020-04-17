/** @format */

const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const validateEmail = require('../validate/email')

const validatePresenceOf = value => value && value.length

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  hashed_password: { type: String },
  salt: { type: String },
  authToken: { type: String },
  // role: { type: Schema.ObjectId, ref: 'UserRole' },
  settingSms: {
    provider: { type: String, default: 'sms.ru' },
    apiId: { type: String },
    lengthPassword: { type: Number, default: 4 },
    text: { type: String },
    limitForOnePhone: { type: Number, default: 3 },
  },
})

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

UserSchema.path('hashed_password')
  .required(true, 'Введите пароль')
  .validate(function (hashed_password) {
    return hashed_password.length && this._password.length
  }, 'Password cannot be blank')

UserSchema.path('name')
  .required(true, 'Введите ваше имя')
  .validate(name => {
    return name.length
  }, 'Введите ваше имя')

UserSchema.path('email')
  .required(true, 'Введите email адрес')
  .validate(email => {
    return email.length && validateEmail(email)
  }, 'Введите корректный email адрес')
  .validate(function (email) {
    return new Promise(resolve => {
      const User = mongoose.model('User')
      if (this.isNew || this.isModified('email')) {
        User.find({ email }).exec((err, users) =>
          resolve(!err && !users.length),
        )
      } else resolve(true)
    })
  }, 'Email {VALUE} уже зарегистрирован')

// Методы
UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + ''
  },

  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    } catch (err) {
      return ''
    }
  },
}

// Статические методы
UserSchema.statics = {
  load: function (id) {
    return this.findById(id).exec()
  },

  list: function (options) {
    const creteria = options.creteria || {}
    const page = options.page || 0
    const limit = options.limit || 10
    return this.find(creteria)
      .sort({ createdDate: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec()
  },
}

mongoose.model('User', UserSchema)
