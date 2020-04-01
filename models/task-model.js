const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  task: String,
  value: Number,
  tally: Number,
  user: String,
})

taskSchema.methods.serialize = function() {
  return {
    id: this._id,
    task: this.task,
    value: this.value,
    tally: this.tally,
    user: this.user,
  }
}

module.exports = mongoose.model('Task', taskSchema)
