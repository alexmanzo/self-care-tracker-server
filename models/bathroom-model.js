const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = global.Promise

const bathroomSchema = new mongoose.Schema({
  location: { type: String, required: true, unique: true },
  zip: { type: Number, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true }
});

bathroomSchema.plugin(uniqueValidator, { message: 'This location ha already been added.' })

bathroomSchema.methods.serialize = function() {
  return {
    id: this._id,
    location: this.location,
    zip: this.zip,
    address: this.address,
    type: this.type
  };
};

module.exports = mongoose.model("Bathroom", bathroomSchema);
