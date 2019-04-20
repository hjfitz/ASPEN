

const chai = require('chai')
const cap = require('chai-as-promised')
const {fhirBase} = require('./util')

// attempt to load .env file

chai.use(cap)

const {expect} = chai

const requests = [
	() => fhirBase.get('/Patient'),
	() => fhirBase.get('/Location/?type=Ward'),
	() => fhirBase.get('/Practitioner'),
	() => fhirBase.get('/Encounter/?class=admission&_include=Encounter:patient;location'),
	() => fhirBase.get('/Encounter/?class=admission&_include=Encounter:patient'),
]

describe('stress-test', () => {
	it('should respond quickly under load', () => {
		const proms = []
		for (let i = 0; i < 100; i++) {
			const idx = ~~(Math.random() * requests.length)
			proms.push(requests[idx])
		}
		const start = process.hrtime()
		Promise.all(proms.map(prom => prom())).then(() => {
			const end = process.hrtime(start)
			const ms = (end[0] * 1000) + (end[1] / 1000000)
			console.log(`time taken: ${ms}ms`)
			// expect to be less than 2 seconds
			expect(ms).to.be.below(2000)
		})
	})
})
