const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')

const expect = chai.expect

const { app, runServer, closeServer } = require('../server')
const Bathroom = require('../models/bathroom-model')
const { TEST_DATABASE_URL } = require('../config')

chai.use(chaiHttp)

function seedBathroomData () {
	console.info('seeding data')
	const seedData = []

	for (let i=1; i<=10; i++) {
		seedData.push(generateBathroomData())
	}

	return Bathroom.insertMany(seedData)
}

function generateBathroomData () {
	return {
    location: faker.lorem.word(),
    zip: Math.floor(Math.random()*100000),
    address: faker.lorem.word(),
    type: faker.lorem.word()
	}
}

function tearDownDb() {
	console.warn('Deleting database')
	return mongoose.connection.dropDatabase()
}

describe('Bathroom API', function() {
	before(function(){
		return runServer(TEST_DATABASE_URL)
	})

	beforeEach(function(){
		return seedBathroomData()
	})

	afterEach(function() {
		return tearDownDb()
	})

	after(function() {
		return closeServer()
	})

	describe('GET endpoint', function() {

		it('should return all existing bathroom locations', function () {
			let res;
			return chai.request(app)
				.get('/api/bathrooms')
				.then(function(_res){
					res = _res
					expect(res).to.have.status(200)
					expect(res.body).to.have.length.of.at.least(1)
					return Bathroom.count()
			})
		})

		it('should return bathroom location with right fields', function () {
			let resBathroom;
			return chai.request(app)
				.get('/api/bathrooms')
				.then(function(res) {
					expect(res).to.have.status(200)
					expect(res).to.be.json
					expect(res.body).to.be.a('array')
					expect(res.body).to.have.length.of.at.least(1)

					res.body.forEach(function(bathroom){
						expect(bathroom).to.be.a('object')
						expect(bathroom).to.include.keys('id', 'location', 'zip', 'address', 'type')
					})

					resBathroom = res.body[0]
					return Bathroom.findById(resBathroom.id)
				})
				.then (function(bathroom){
					expect(resBathroom.id).to.equal(bathroom.id)
          expect(resBathroom.location).to.equal(bathroom.location)
          expect(resBathroom.zip).to.equal(bathroom.zip)
          expect(resBathroom.address).to.equal(bathroom.address)
          expect(resBathroom.type).to.equal(bathroom.type)
				})

		})
	})

	describe('POST endpoint', function() {
		it('should add a new bathroom location', function() {
			const newBathroom = generateBathroomData()

			return chai.request(app)
				.post('/api/bathrooms')
				.send(newBathroom)
				.then(function(res){
					expect(res).to.have.status(201)
					expect(res).to.be.json
					expect(res.body).to.be.a('object')
					expect(res.body).to.include.keys('id', 'location', 'zip', 'address', 'type')
					expect(res.body.id).to.not.be.null
          expect(res.body.location).to.equal(newBathroom.location)
          expect(res.body.zip).to.equal(newBathroom.zip)
          expect(res.body.address).to.equal(newBathroom.address)
          expect(res.body.type).to.equal(newBathroom.type)
				})
		})
	})

	describe('DELETE endpoint', function() {
		let bathroom;
		
		it('should delete a bathroom location', function () {
			return Bathroom
			.findOne()
			.then(function(_bathroom) {
				bathroom = _bathroom
				return chai.request(app).delete(`/api/bathrooms/${bathroom.id}`)
			})
			.then(function(res) {
				expect(res).to.have.status(201)
				return Bathroom.findById(bathroom.id)
			})
			.then(function(_bathroom) {
				expect(_bathroom).to.be.null
			})
		})


	})

	describe('PUT endpoint', function(){
		it('should update field you send over', function() {
			const updateData = {
				address: faker.lorem.word()
			}

			return Bathroom
				.findOne()
				.then(function(bathroom) {
					updateData.id = bathroom.id

					return chai.request(app)
						.put(`/api/bathrooms/${bathroom.id}`)
						.send(updateData)
				})
				.then(function(res) {
					expect(res).to.have.status(201)

					return Bathroom.findById(updateData.id)
				})
				.then(function(bathroom) {
					expect(bathroom.address).to.equal(updateData.address)
				})
		})
	})
})




