const chai = require('chai')
const cap = require('chai-as-promised')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
// attempt to load .env file
const envLoc = path.join(process.cwd(), '.env')
if (fs.existsSync(envLoc)) {
	const lines = fs.readFileSync(envLoc).toString().split('\n')
	lines.forEach((line) => {
		const [key, ...rest] = line.split('=')
		const val = rest.join('=')
		process.env[key] = val
	})
}

const knex = require('knex')({
	client: 'pg',
	connection: process.env.DATABASE_URL,
})

chai.use(cap)

const {expect} = chai

// this is where secret = "Cross-Origin%20Read%20Blocking%20(CORB)%20blocked%20cross-origin%20response"
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhmaXR6ODNAZ21haWwuY29tIiwidXNlcmlkIjoxLCJwZXJtaXNzaW9ucyI6WyJhZGQ6cGF0aWVudHMiLCJhZGQ6d2FyZHMiXSwibmFtZSI6IkhhcnJ5IEZpdHpnZXJhbGQiLCJnaXZlbl9uYW1lIjoiSGFycnkiLCJmYW1pbHlfbmFtZSI6IkZpdHpnZXJhbGQiLCJpYXQiOjE1NTU2MTc1NjJ9.Ux_PT_gG10QX8gmlukPKMR7jnbYeQFPPTMR8OnKiDbU'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwidXNlcmlkIjo1LCJwZXJtaXNzaW9ucyI6WyJ2aWV3OmFsbHBhdGllbnRzIiwiZWRpdDpwZXJtaXNzaW9ucyIsInZpZXc6YWxsIl0sImlhdCI6MTU1NTYyNTMyMn0.vwglJTOquQzqpX7Jhcoe0-DdctME7Gvxwjf2u75Id2E'
const noPermsToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVwNzgwNDYxQG15cG9ydC5hYy51ayIsInVzZXJpZCI6NCwicGVybWlzc2lvbnMiOltdLCJuYW1lIjoiSGFycnkgRml0emdlcmFsZCIsImhkIjoibXlwb3J0LmFjLnVrIiwiZ2l2ZW5fbmFtZSI6IkhhcnJ5IiwiZmFtaWx5X25hbWUiOiJGaXR6Z2VyYWxkIiwiaWF0IjoxNTU1NjI0MTg1fQ.2TW1UIozHxsHZ8QIq004qtLq2k5jkFVCIKzGStjRpPY'
const serverHost = 'http://localhost:5000'

const fhirBase = axios.create({
	baseURL: `${serverHost}/fhir`,
	headers: {
		accept: 'application/fhir+json',
		token,
	},
})


describe('FHIR API', () => {
	describe('Generic operations', () => {
		// initial fail: does not redirect with correct statuscode
		it('should reject requests that do not have accept:application/fhir+json in their header', (done) => {
			axios.get(`${serverHost}/fhir/Patient`, {
				headers: {token},
			}).catch((err) => {
				expect(err.response.data.resourceType).to.equal('OperationOutcome')
				expect(err.response.data.issue[0].code).to.equal(406)
				// console.log(err.response.data)
				done()
			})
		})

		it('should reject unauthorised requests', (done) => {
			axios.get(`${serverHost}/fhir/Patient`)
				.then((data) => {
					const {responseUrl} = data.request.res
					const index = responseUrl.indexOf('https://accounts.google.com/ServiceLogin')
					expect(index).to.equal(0)
					done()
				})
		})

		it('should allow normal requests', (done) => {
			fhirBase.get('/Patient').then((response) => {
				expect(response.data.resourceType).to.equal('Bundle')
				done()
			})
		})
	})

	describe('/History', () => {
		describe('POST /', () => {
			it('should create a history with all required fields', () => {

			})
		})

		describe('GET /$ID', () => {
			it('should get a patient history', () => {

			})
		})
	})

	describe('/Location', () => {
		describe('GET /?type=Ward', () => {
			it('should list all locations of type WARD in FHIR format', (done) => {
				fhirBase.get('/Location/?type=Ward').then((response) => {
					const isArr = Array.isArray(response.data)
					const len = response.data.length
					const allWards = response.data.filter(location => location.coding[0].code === 'wa')
					// eslint-disable-next-line no-unused-expressions
					expect(isArr).to.be.true
					expect(allWards.length).to.equal(len)
					done()
				})
			})
		})

		describe('POST /', () => {
			it('should create a new ward with just a description and name', (done) => {
				fhirBase.post('/Location', {
					type: 'ward',
					name: `test ward${new Date().getTime()}`,
					description: 'a ward created by some unit test',
				}).then((response) => {
					expect(response.data.resourceType).to.equal('OperationOutcome')
					expect(response.data.issue[0].severity).to.equal('success')
					done()
				}).catch((err) => {
					console.log(err)
				})
			})

			it('should return an OperationOutcome with an malformed request (no ward name)', (done) => {
				fhirBase.post('/Location', {
					type: 'ward',
					description: 'a ward created by some unit test',
				}).catch((err) => {
					expect(err.response.data.resourceType).to.equal('OperationOutcome')
					expect(err.response.data.details.text).to.equal('Error with query!')
					done()
				})
			})
		})
	})

	describe('/Patient', () => {
		describe('POST /', () => {
			it('should create a patient', (done) => {
				knex('location').select()
					.then(rows => rows[0])
					.then(row => fhirBase.post('/Patient', {
						'patient-prefix': 'Mr',
						'patient-given': 'Harry',
						'patient-family': 'Fitzgerald',
						'patient-fullname': 'Harry Fitzgerald',
						'patient-gender': 'male',
						location_id: row.location_id,
						'contact-prefix': 'Mr',
						'contact-fullname': 'Harry Fitzgerald',
						'contact-given': 'Harry',
						'contact-phone': '0743823423',
					}))
					.then((response) => {
						expect(response.data.resourceType).to.equal('OperationOutcome')
						expect(response.data.issue[0].code).to.equal(200)
						done()
					})
			})

			it('should not allow creation of a when FHIR required data is missing', (done) => {
				fhirBase.post('/Patient', {
					'patient-prefix': 'Mr',
					'patient-given': 'TestData',
					'patient-fullname': 'TestData TestDataFYP',
					'patient-gender': 'male',
					'contact-fullname': 'Harry Fitzgerald',
					'contact-given': 'Harry',
					'contact-phone': '0743823423',
				}).catch((err) => {
					expect(err.response.data.resourceType).to.equal('OperationOutcome')
					expect(err.response.data.issue[0].details.text).to.equal('Unable to insert contact')
					done()
				})
			})

			it('should not create a patient when the contact is missing', (done) => {
				knex('location').select()
					.then(rows => rows[0])
					.then(row => fhirBase.post('/Patient', {
						'patient-prefix': 'Mr',
						'patient-given': 'Harry',
						'patient-family': 'Fitzgerald',
						'patient-gender': 'male',
						location_id: row.location_id,
					}))
					.catch((err) => {
						expect(err.response.data.resourceType).to.equal('OperationOutcome')
						expect(err.response.data.issue[0].details.text).to.equal('Unable to insert contact')
						done()
					})
			})
		})

		// fail: did not return so multiple HTTP send requests sent and server crashes
		describe('GET /?_query', () => {
			it('should enable querying for a patient', (done) => {
				let enc
				knex('patient').select().then((rows) => {
					const {given} = rows[0]
					enc = encodeURIComponent(given)
					return fhirBase.get(`/Patient?_query=${enc}`)
				}).then((resp) => {
					// eslint-disable-next-line no-unused-expressions
					expect(Array.isArray(resp.data)).to.be.true
					expect(resp.data[0].name[0].given).to.equal(enc)
					done()
				})
			})
		})

		// initial fail - due to being PK in practitionerpatients, would not delete from db and thus crash
		// issue with agile - infrastructure goes bad as you sprint. this was added later and thus lost
		describe('DELETE /$ID', () => {
			it('should delete an entry based on patient ID', (done) => {
				// get ID
				knex('patient')
					.where({patient_id: 99999})
					.then((row) => {
						if (row.length) {
							return knex('contact').where({contact_id: row[0].contact_id}).delete().then(() => knex('patient').where({patient_id: 99999}).delete())
						}
						return ''
					}).then(() => {
					// check exists before adding
						knex('contact').where({contact_id: 99999}).then((rows) => {
							if (rows.length) {
								return knex('contact').insert({
									contact_id: 99999,
									prefix: 'mr',
									fullname: 'test data',
									given: 'test',
									phone: '0742384237',
								})
							}
						}).then(() => knex('patient')
							.insert({
								patient_id: 99999,
								active: true,
								fullname: 'this is a test fullname',
								given: 'this is a test given',
								prefix: 'Dr',
								gender: 'male',
								last_updated: new Date(),
							})
							.returning('*'))
							.then(row => fhirBase.delete(`/Patient/${row[0].patient_id}`))
							.then(() => knex('patient').select().where({patient_id: '99999'}))
							.then((row) => {
								expect(row.length).to.equal(0)
								done()
							})
					})
			})
		})
	})

	describe('/Practitioner', () => {
		describe('GET /', () => {
			it('should return a Bundle resource with all practitioners', (done) => {
				fhirBase.get('/Practitioner').then((response) => {
					expect(response.data.resourceType).to.equal('Bundle')
					expect(response.data.entry.length).to.be.a('number')
					done()
				})
			})
		})

		describe('GET /$ID', () => {
			it('should return one FHIR Practitioner', (done) => {
				knex('practitioner')
					.where({practitioner_id: 99999})
					.delete()
					.then(() => {
						knex('practitioner').insert({
							practitioner_id: 99999,
							name: 'test practitioner',
							added: new Date(),
							username: `test practitioner${new Date().getTime()}`,
							account_type: 'normal',
							permissions: '[]',
						}).returning('*').then(rows => rows[0])
							.then(row => fhirBase.get(`/Practitioner/${row.practitioner_id}`))
							.then((response) => {
								expect(response.data.resourceType).to.equal('Practitioner')
								expect(response.data.id).to.equal(99999)
								expect(response.data.name[0].given[0]).to.equal('test practitioner')
								done()
							})
							.then(() => knex('practitioner')
								.where({practitioner_id: 99999})
								.delete())
					})
			})
		})
	})

	describe('/Encounter', () => {
		describe('POST /', () => {
			it('should create an encounter given valid IDs', (done) => {
				knex('contact').insert({
					contact_id: 99999,
					prefix: 'mr',
					fullname: 'test data',
					given: 'test',
					phone: '0742384237',
				}).then(() => knex('patient').insert({
					patient_id: 99999,
					active: true,
					fullname: 'Harry Fitzgerald',
					given: 'Harry',
					prefix: 'Mr',
					last_updated: new Date(),
					gender: 'male',
					contact_id: 99999,
				}).returning('*').then(row => row[0])
					.then(patient => knex('location').insert({
						location_id: 99999,
						name: 'test location',
						last_updated: new Date(),
						status: 'active',
						description: 'test location',
						type: 'ward',
					}).returning('*').then(row => row[0])
						.then(() => fhirBase.post('/Encounter', {
							class: 'admission',
							status: 'finished',
							patient_id: 99999,
							location_id: 99999,
						}).then((response) => {
							expect(response.data.resourceType).to.equal('OperationOutcome')
							expect(response.data.issue[0].severity).to.equal('success')
							expect(response.data.issue[0].code).to.equal(200)
							// cleanup
							console.log(patient)
							knex('encounter')
								// .where({location_id: 99999})
								.delete().then(() => knex('contact')
									.where({contact_id: 99999})
									.delete().then(() => knex('location')
										.where({location_id: 99999})
										.delete())).catch(err => console.log(err))
						})
							.then(() => done()))))
			})

			it('should error on no data', (done) => {
				fhirBase.post('/Encounter', {
					class: 'admission',
					status: 'finished',
				}).catch((err) => {
					expect(err.response.data.resourceType).to.equal('OperationOutcome')
					expect(err.response.data.issue[0].severity).to.equal('error')
					expect(err.response.data.issue[0].code).to.equal(406)
					done()
				})
			})

			// error: not added permissions here!
			it('should not create an encounter if the user does not have the correct permissions', (done) => {
				fhirBase.post('/Encounter', {
					class: 'admission',
					status: 'finished',
					patient_id: 99999,
					location_id: 99999,
				}, {headers: {token: noPermsToken}})
					.catch((err) => {
						expect(err.response.data.resourceType).to.equal('OperationOutcome')
						expect(err.response.data.issue[0].severity).to.equal('error')
						expect(err.response.data.issue[0].code).to.equal(403)
						expect(err.response.data.issue[0].details.text).to.equal('you have no access!')
						done()
						// cleanup
						return knex('encounter')
							.where({patient_id: 99999, location_id: 99999})
							.delete()
					})
			})
		})

		describe('GET /?class=admission&_include=Encounter:patient;location', () => {
			it('should return all admissions with ward information and patient information', (done) => {
				fhirBase.get('/Encounter/?class=admission&_include=Encounter:patient;location').then((response) => {
					expect(Array.isArray(response.data)).to.be.true
					done()
				})
			})

			it('should not let a user see all patients if the correct permission does not exist', (done) => {
				fhirBase.get('/Encounter/?class=admission&_include=Encounter:patient;location', {
					headers: {
						token: noPermsToken,
					},
				}).catch((err) => {
					expect(err.response.data.resourceType).to.equal('OperationOutcome')
					expect(err.response.data.issue[0].severity).to.equal('error')
					expect(err.response.data.issue[0].code).to.equal(403)
					expect(err.response.data.issue[0].details.text).to.equal('you have no access!')
					done()
				})
			})
		})

		describe('GET /?class=admission&_include=Encounter:patient', () => {
			it('should return all encounters with basic location information Location/$NUM and patients', (done) => {
				fhirBase.get('/Encounter/?class=admission&_include=Encounter:patient').then((response) => {
					console.log(response.data)
					done()
				})
			})
		})

		describe(' GET /?class=admission&patient_id=$ID&_include=Encounter:patient', () => {
			it('should return all patient information for a given patient', (done) => {

			})
		})

		describe('GET /?class=admission&location_id=$ID&_include=Encounter:patient', () => {
			it('should return all patient admissions for the given location', (done) => {

			})
		})
	})

	describe('/Diagnostics', () => {
		describe('POST /', () => {
			it('should create entries for each observation and the entire report', () => {

			})
		})

		describe('GET /?patient=$ID', () => {
			it('should get all history for a patient with a given ID', () => {

			})
		})

		describe('GET /?patient=$ID&count=$NUM', () => {
			it('should return 10 results', () => {

			})

			it('should return 5 results', () => {

			})
		})

		describe('GET /?patient=$ID&count=$NUM&pageNo=$NUM', () => {
			it('should return the first page of results', () => {

			})

			it('should return the second page of results', () => {

			})
		})
	})
})
