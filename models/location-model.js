const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = global.Promise

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  type: { type: String, required: true },
})

locationSchema.plugin(uniqueValidator, {
  message: 'This location ha already been added.',
})

locationSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    street: this.street,
    city: this.city,
    state: this.state,
    zip: this.zip,
    latitude: this.latitude,
    longitude: this.longitude,
    type: this.type,
  }
}

module.exports = mongoose.model('Location', locationSchema)
