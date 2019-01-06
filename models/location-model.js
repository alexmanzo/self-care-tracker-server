const mongoose = require('mongoose')
mongoose.Promise = global.Promise

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
    type: [String],
    required: [true, 'Type field is required'],
  },
  googlePlaceId: {
    type: [String],
    required: [true, 'Google Place ID required.']
  },
  loc: {
    type: {
      default: 'Point',
      type: String,
    },
    coordinates: {
      type: [Number],
    },
  },
})

locationSchema.index({ loc: '2dsphere' })

locationSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    street: this.street,
    city: this.city,
    state: this.state,
    zip: this.zip,
    type: this.type,
    googlePlaceId: this.googlePlaceId,
    loc: this.loc,
  }
}

module.exports = mongoose.model('Location', locationSchema)
