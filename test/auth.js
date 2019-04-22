const axios = require('axios')

const chai = require('chai')
const cap = require('chai-as-promised')
require('./util')
const {knex} = require('../src/server/db')

chai.use(cap)

const {expect} = chai

const authBase = axios.create({
	baseURL: 'http://localhost:5000/',
})

const randString = (length = 7) => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length)

const createPayload = () => ({
	username: randString(),
	password: 'UpperLower',
	name: randString(9),
})

describe('authentication', () => {
	describe('sign-up', () => {
		it('should create an account if the detail does not exist within the database', (done) => {
			const payload = createPayload();
			(async () => {
				const resp = await authBase.post('/login/create', payload)
				expect(resp.data).to.equal(`Successfully registered. Welcome, ${payload.name}`)
				done()
				await knex('practitioner').where({username: payload.username}).del()
			})()
		})

		it('should not enable creation of a user with no password', (done) => {
			const payload = createPayload()
			delete payload.password;
			(async () => {
				try {
					await authBase.post('/login/create', payload)
				} catch (err) {
					expect(err.response.data).to.equal("Couldn't register! Missing: password")
					done()
				}
			})()
		})

		it('should not enable creation if the username is in use', (done) => {
			const payload = createPayload();
			(async () => {
				await authBase.post('/login/create', payload)
				try {
					await authBase.post('/login/create', payload)
				} catch (err) {
					expect(err.response.data).to.equal("Couldn't register! Username already exists")
					done()
				}
				await knex('practitioner').where({username: payload.username}).del()
			})()
		})

		it('should not enable creation with a weak password', (done) => {
			const payload = createPayload()
			payload.password = 'a';
			(async () => {
				try {
					await authBase.post('/login/create', payload)
				} catch (err) {
					expect(err.response.data).to.equal('Issue with password: At least 10 characters in length')
					done()
				}
			})()
		})
	})
	describe('login', () => {
		it('should login with a normal username and password', (done) => {
			const payload = createPayload();
			(async () => {
				await authBase.post('/login/create', payload)
				// try to login
				const {data} = await authBase.post('/login', {
					username: payload.username,
					password: payload.password,
				})
				expect(data.message).to.equal(`Welcome back, ${payload.name}`)
				// expect a JWT in the response
				expect(data.token.split('.').length).to.equal(3)
				done()
				// db cleanup
				await knex('practitioner').where({username: payload.username}).del()
			})()
		})
		it('should not enable login with a google account username', (done) => {
			(async () => {
				// create google user
				const username = randString(12)
				const password = ''
				const practitioner_id = ~~(new Date().getTime() / 10000)
				await knex('practitioner').insert({
					practitioner_id,
					username,
					name: randString(),
					added: new Date(),
					account_type: 'google',
					permissions: '[]',
				})
				// make request
				try {
					await authBase.post('/login', {username, password})
				} catch (err) {
					// should not exist as db pulls WHERE account_type = 'normal'
					expect(err.response.data).to.equal('Unable to login: username does not exist!')
					done()
				}
			})()
		})
		it('should save the password hash to the database', (done) => {
			const payload = createPayload();
			(async () => {
				await authBase.post('/login/create', payload)
				const [row] = await knex('practitioner').where({username: payload.username})
				expect(row.password).to.not.equal(payload.password)
				done()
				await knex('practitioner').where({username: payload.username}).del()
			})()
		})
	})
})
