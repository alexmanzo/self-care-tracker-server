const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const jsonParser = bodyParser.json()
const Location = require('../models/location-model')
mongoose.Promise = global.Promise

// ----- GET Requests ----- //

// All Locations //
router.get('/', jsonParser, (req, res) => {
  Location.find(req.query)
    .collation({ locale: 'en_US', strength: 1 })
    .sort({ location: 1 })
    .then(locations => {
      res.json(locations.map(location => location.serialize()))
    })
    .catch(err => {
      res.status(500).json({ error: 'Server Error Get' })
    })
})

// // Location by ID //
// router.get('/:id', (req, res) => {
//   Location.findById(req.params.id)
//     .then(location => {
//       res.json(location.serialize())
//     })   
//     .catch(err => {
//       res.status(500).json({ error: 'Server Error Get ID' })
//     })
// })

// Location by Geography//
router.get('/geography', (req, res) => {
  Location.aggregate()
    .near({
      near: {
        type: 'Point',
        coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
      },
      maxDistance: 100000,
      spherical: true,
      distanceField: 'dis',
    })
    .then(locations => {
      res.json(locations)
    })
    .catch(err => {
      res.status(500).json({ error: `${err}` })
    })
})

// ----- POST Requests ----- //
router.post('/', jsonParser, (req, res) => {
  if (req.body.location == '') {
    res.status(400).json({ error: 'No location added' })
  }
  Location.find({ name: req.body.name }, { zip: req.body.zip })
    .limit(1)
    .then(results => {
      if (results.length > 0) {
        res.status(500).json({ error: 'This location already exists' })
      } else {
        Location.create(req.body)
          .then(location => res.status(201).json(location.serialize()))
          .catch(err => {
            console.error(err)
            res.status(500).json({ error: `${err}` })
          })
      }
    })
})

// ----- PUT Requests ----- //
router.put('/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match',
    })
  }

  Location.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(update => res.status(201).json({ message: 'update succeded' }))
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: 'something went wrong' })
    })
})

// ----- DELETE Requests -----//
router.delete('/:id', (req, res) => {
  Location.findByIdAndRemove(req.params.id)
    .then(update => res.status(201).json({ message: 'location deleted' }))
    .catch(err => res.status(500).json({ message: 'something went wrong' }))
})

module.exports = router
