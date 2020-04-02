const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const jsonParser = bodyParser.json()
const Task = require('../models/task-model')
mongoose.Promise = global.Promise

// ----- GET Requests ----- //

// Get All Tasks //
router.get('/', jsonParser, (req, res) => {
  Task.find({})
    .then(tasks => {
      res.json(tasks.map(task => task.serialize()))
    })
    .catch(err => {
      res.status(500).json({ error: `Server Error ${err}` })
    })
})

// Task by User Id //
router.get('/id/:id', (req, res) => {
  Task.find({ user: req.params.id })
    .then(tasks => {
      res.json(tasks.map(task => task.serialize()))
    })
    .catch(err => {
      res.status(500).json({ error: `${err}` })
    })
})

// ----- POST Requests ----- //
router.post('/', jsonParser, (req, res) => {
  // Don't process without a body
  if (req.body.task == '') {
    res.status(400).json({ error: 'No task added' })
  }

  const { task, user } = req.body;
  // Check to see if this task exists in database.
  Task.find({ task, user })
    // We only need to find one to throw the error
    .limit(1)
    .then(results => {
      // If it doesn't exist, we can create a new document based on our body
      if (results.length === 0) {
        Task.create(req.body)
          // Send back new task in response
          .then(task => res.status(201).json(task.serialize()))
          // Catch error in creating new task
          .catch(err => {
            res.status(500).json({ error: `${err}` })
          })
      } else {
        // Throw error if duplicate task exists
        throw new Error('This task already exists.')
      }
    })
    // Catch the error we just threw
    .catch(err => {
      res.status(500).json({ message: `${err}` })
    })
})

// ----- PUT Requests ----- //
router.put('/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match',
    })
  }

  Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(update => res.status(201).json(update.serialize()))
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: 'something went wrong' })
    })
})

// // ----- DELETE Requests -----//
// router.delete('/:id', (req, res) => {
//   Location.findByIdAndRemove(req.params.id)
//     .then(update => res.status(201).json({ message: 'location deleted' }))
//     .catch(err => res.status(500).json({ message: 'something went wrong' }))
// })

module.exports = router
