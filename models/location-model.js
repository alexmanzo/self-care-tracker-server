const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = global.Promise

const geoSchema = new mongoose.Schema({
  type: {
    default: 'Point',
    type: String,
  },
  coordinates: {
    type: [Number],
    index: '2dsphere'
  },
})

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is required'],
  },
  street: {
    type: String,
    required: [true, 'Street field is required'],
  },
  city: {
    type: String,
    required: [true, 'City field is required'],
  },
  state: {
    type: String,
    required: [true, 'State field is required'],
  },
  zip: {
    type: Number,
    required: [true, 'Zip field is required'],
  },
  type: {
    type: String,
    required: [true, 'Type field is required'],
  },
  geometry: geoSchema
})

locationSchema.index( "2dsphere" )


locationSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    street: this.street,
    city: this.city,
    state: this.state,
    zip: this.zip,
    type: this.type,
    geometry: this.geometry
  }
}


module.exports = mongoose.model('Location', locationSchema)
