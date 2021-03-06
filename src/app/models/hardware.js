/** @format */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validateIp = require('../validate/ip')

const HardwareSchema = new Schema({
  name: { type: String },
  vendor: { type: String },
  model: { type: String },
  ipAddress: { type: String },
  radiusSecret: { type: String },
  installationAddress: { type: String },
  status: { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
})

HardwareSchema.path('name')
  .required(true, 'Введите имя объекта')
  .validate(name => {
    return name.length
  }, 'Введите имя объекта')

HardwareSchema.path('ipAddress')
  .required(true, 'Введите IP адрес')
  .validate(ip => {
    return ip.length && validateIp(ip)
  }, 'Введите корректный IP адрес')

HardwareSchema.path('radiusSecret')
  .required(true, 'Введите секретный ключ')
  .validate(radiusSecret => {
    return radiusSecret.length > 5
  }, 'Секретный ключ должен содержать больше 5 символов')

// При обновлении документа увеличиваем его версию и дату обновления
HardwareSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedDate: new Date() })
  const update = this.getUpdate()
  if (update.__v != null) {
    delete update.__v
  }
  const keys = ['$set', '$setOnInsert']
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v
      if (Object.keys(update[key]).length === 0) {
        delete update[key]
      }
    }
  }
  update.$inc = update.$inc || {}
  update.$inc.__v = 1
})

HardwareSchema.statics = {
  load: function (id) {
    return this.findById(id).populate('user', 'name').exec()
  },

  list: function (options) {
    const creteria = options.creteria || {}
    const page = options.page || 0
    const limit = options.limit || 10
    return this.find(creteria)
      .populate('user', 'name')
      .sort({ name: 1 })
      .limit(limit)
      .skip(limit * page)
      .exec()
  },
}

mongoose.model('Hardware', HardwareSchema)
