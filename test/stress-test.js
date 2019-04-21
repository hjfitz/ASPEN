/* eslint-disable */

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

async function stressTest() {
	console.log('===== BEGINNING STRESS TEST')
	let total = 0
	for (let i = 0; i < 3; i++) {
		console.log(`===== Test: ${i}`)
		const proms = []
		for (let j = 0; j < 100; j++) {
			const idx = ~~(Math.random() * requests.length)
			proms.push(requests[idx])
		}
		const start = process.hrtime()
		await Promise.all(proms.map(prom => prom()))
		const end = process.hrtime(start)
		const ms = (end[0] * 1000) + (end[1] / 1000000)
		console.log(`test ${i}; time taken: ${ms}ms`)
		total += ms
	}
	console.log(`average: ${total / 3}`)
	console.log('===== END OF STRESS TEST')
}

stressTest()

