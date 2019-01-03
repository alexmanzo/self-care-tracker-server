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
    Location.find()
        .collation({ locale: 'en_US', strength: 2 })
        .sort({ location: 1 })
        .then(locations => {
            res.json(locations.map(location => location.serialize()))
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'Server Error' })
        })
})

// Location by ID //
router.get('/:id', (req, res) => {
    Location.findById(req.params.id)
        .then(location => {
            res.json(location.serialize())
        })
        .catch(err => {
            res.status(500).json({ error: 'Server Error' })
        })
})

// Location by Location Type //
router.get('/type/:type', (req, res) => {
    Location.find({ type: req.params.type })
        .collation({ locale: 'en_US', strength: 2 })
        .sort({ location: 1 })
        .then(locations => {
            res.json(locations.map(location => location.serialize()))
        })
        .catch(err => {
            res.status(500).json({ error: 'Server Error' })
        })
})

// Location by Zip Code //
router.get('/zip/:zip', (req, res) => {
    Location.find({
            zip: {
                $gte: parseInt(req.params.zip) - 15,
                $lte: parseInt(req.params.zip) + 15,
            },
        })
        .collation({ locale: 'en_US', strength: 2 })
        .sort({ location: 1 })
        .then(locations => {
            res.json(locations.map(location => location.serialize()))
        })
        .catch(err => {
            res.status(500).json({ error: `${err}` })
        })
})

// Location by Name and Zip //
router.get('/query/place', jsonParser, (req, res) => {
    Location.find(req.body)
        .then(location => res.json(location))
        .catch(err => {
          console.error(err)
            res.status(500).json({ error: 'something fucked up' })
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
                Location.create({
                        name: req.body.name,
                        street: req.body.street,
                        city: req.body.city,
                        state: req.body.state,
                        zip: req.body.zip,
                        latitude: req.body.latitude,
                        longitude: req.body.longitude,
                        type: req.body.type,
                    })
                    .then(location => res.status(201).json(location.serialize()))
                    .catch(err => {
                        console.error(err)
                        res.status(500).json({ error: 'Something went wrong' })
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