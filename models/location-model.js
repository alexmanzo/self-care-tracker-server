const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = global.Promise

const locationSchema = new mongoose.Schema({
  location: { type: String, required: true, unique: true },
  zip: { type: Number, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true }
});

locationSchema.plugin(uniqueValidator, { message: 'This location ha already been added.' })

locationSchema.methods.serialize = function() {
  return {
    id: this._id,
    location: this.location,
    zip: this.zip,
    address: this.address,
    type: this.type
  };
};

module.exports = mongoose.model("Location", locationSchema);
