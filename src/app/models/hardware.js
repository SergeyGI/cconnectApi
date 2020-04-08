/** @format */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HardwareSchema = new Schema({
  name: { type: String },
  vendor: { type: String },
  model: { type: String },
  ipAddress: { type: String },
  radiusSecret: { type: String },
  installationAddress: { type: String },
  status: { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
})

// Валидация
HardwareSchema.path('name').validate(function (name) {
  return name.length
}, '<name> cannot be blank')

HardwareSchema.path('model').validate(function (model) {
  return model.length
}, '<model> cannot be blank')

HardwareSchema.path('ipAddress').validate(function (ipAddress) {
  return ipAddress.length
}, '<ipAddress> cannot be blank')

HardwareSchema.path('radiusSecret').validate(function (radiusSecret) {
  return radiusSecret.length
}, '<radiusSecret> cannot be blank')

HardwareSchema.path('installationAddress').validate(function (
  installationAddress,
) {
  return installationAddress.length
},
'<installationAddress> cannot be blank')

HardwareSchema.statics = {
  load: function (id) {
    console.log(mongoose.isValidObjectId(id))
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
