const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')

const expect = chai.expect

const { app, runServer, closeServer } = require('../server')
const Location = require('../models/location-model')
const { TEST_DATABASE_URL } = require('../config')

chai.use(chaiHttp)

function seedLocationData() {
  console.info('seeding data')
  const seedData = []

  for (let i = 1; i <= 10; i++) {
    seedData.push(generateLocationData())
  }
  return Location.insertMany(seedData)
}

function generateLocationData() {
  return {
    name: faker.company.companyName(),
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: Math.floor(Math.random() * 100000),
    type: faker.lorem.word(),
    loc: {
      type: 'Point',
      coordinates: [78.903628, 35.997326],
    },
  }
}

function tearDownDb() {
  console.warn('Resetting database')
  return Location.remove({}, function(err) {
    console.log(err)
  })
}

describe('Location API', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL)
  })

  beforeEach(function() {
    return seedLocationData()
  })

  afterEach(function() {
    return tearDownDb()
  })

  after(function() {
    return closeServer()
  })

  describe('GET endpoint', function() {
    it('should return all existing locations', function() {
      let res
      return chai
        .request(app)
        .get('/api/locations')
        .then(function(_res) {
          res = _res
          expect(res).to.have.status(200)
          expect(res.body).to.have.length.of.at.least(1)
          return Location.count()
        })
    })

    it('should return location with right fields', function() {
      let resLocation
      return chai
        .request(app)
        .get('/api/locations')
        .then(function(res) {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body).to.be.a('array')
          expect(res.body).to.have.length.of.at.least(1)

          res.body.forEach(function(location) {
            expect(location).to.be.a('object')
            expect(location).to.include.keys(
              'id',
              'name',
              'street',
              'state',
              'zip',
              'type',
              'loc'
            )
          })

          resLocation = res.body[0]
          return Location.findById(resLocation.id)
        })
        .then(function(location) {
          expect(resLocation.id).to.equal(location.id)
          expect(resLocation.name).to.equal(location.name)
          expect(resLocation.street).to.equal(location.street)
          expect(resLocation.city).to.equal(location.city)
          expect(resLocation.state).to.equal(location.state)
          expect(resLocation.zip).to.equal(location.zip)
          expect(resLocation.type).to.equal(location.type)
          expect(resLocation.loc).to.be.a('object')
        })
    })

    it('should return locations based on geography', function() {
      let resLocation
      return chai
        .request(app)
        .get('/api/locations/geography?lat=35.99.7326&lng=78.903628')
        .then(function(res) {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body).to.be.a('array')
          expect(res.body).to.have.length.of.at.least(1)

          res.body.forEach(function(location) {
            expect(location).to.be.a('object')
            expect(location).to.include.keys(
              '_id',
              'loc',
              'name',
              'street',
              'state',
              'zip',
              'type',
              '__v',
              'dis'
            )
          })

          resLocation = res.body[0]
          return Location.findById(resLocation._id)
        })
        .then(function(location) {
          expect(resLocation.loc).to.be.a('object')
          expect(resLocation.loc.type).to.equal(location.loc.type)
          expect(resLocation.loc.coordinates[0]).to.equal(
            location.loc.coordinates[0]
          )
          expect(resLocation.loc.coordinates[1]).to.equal(
            location.loc.coordinates[1]
          )
          expect(resLocation._id).to.equal(location.id)
          expect(resLocation.name).to.equal(location.name)
          expect(resLocation.street).to.equal(location.street)
          expect(resLocation.city).to.equal(location.city)
          expect(resLocation.state).to.equal(location.state)
          expect(resLocation.zip).to.equal(location.zip)
          expect(resLocation.type).to.equal(location.type)
        })
    })
  })

  describe('POST endpoint', function() {
    it('should add a new location', function() {
      const newLocation = generateLocationData()

      return chai
        .request(app)
        .post('/api/locations')
        .send(newLocation)
        .then(function(res) {
          expect(res).to.have.status(201)
          expect(res).to.be.json
          expect(res.body).to.be.a('object')
          expect(res.body).to.include.keys(
            'id',
            'name',
            'street',
            'state',
            'zip',
            'type',
            'loc'
          )
          expect(res.body.id).to.not.be.null
          expect(res.body.name).to.equal(newLocation.name)
          expect(res.body.street).to.equal(newLocation.street)
          expect(res.body.city).to.equal(newLocation.city)
          expect(res.body.state).to.equal(newLocation.state)
          expect(res.body.zip).to.equal(newLocation.zip)
          expect(res.body.type).to.equal(newLocation.type)
          expect(res.body.loc.type).to.equal(newLocation.loc.type)
          expect(res.body.loc.coordinates[0]).to.equal(
            newLocation.loc.coordinates[0]
          )
          expect(res.body.loc.coordinates[1]).to.equal(
            newLocation.loc.coordinates[1]
          )
        })
    })
  })

  describe('DELETE endpoint', function() {
    let location

    it('should delete a location', function() {
      return Location.findOne()
        .then(function(_location) {
          location = _location
          return chai.request(app).delete(`/api/locations/${location.id}`)
        })
        .then(function(res) {
          expect(res).to.have.status(201)
          return Location.findById(location.id)
        })
        .then(function(_location) {
          expect(_location).to.be.null
        })
    })
  })

  describe('PUT endpoint', function() {
    it('should update field you send over', function() {
      const updateData = {
        name: faker.company.companyName(),
      }

      return Location.findOne()
        .then(function(location) {
          updateData.id = location.id

          return chai
            .request(app)
            .put(`/api/locations/${location.id}`)
            .send(updateData)
        })
        .then(function(res) {
          expect(res).to.have.status(201)

          return Location.findById(updateData.id)
        })
        .then(function(location) {
          expect(location.name).to.equal(updateData.name)
        })
    })
  })
})
