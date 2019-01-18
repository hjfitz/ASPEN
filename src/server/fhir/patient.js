// https://www.hl7.org/fhir/patient.html
const express = require('express')
const pg = require('pg')
const path = require('path')
const fileUpload = require('express-fileupload')
const shortid = require('shortid')
const mimeTypes = require('mime-types')
const sha1 = require('crypto-js/sha1')
const fs = require('fs')
const logger = require('../../../logger')
const {createOutcome} = require('./util')

const patientRouter = express.Router()
let isConnected = false

const client = new pg.Client(process.env.DATABASE_URL)
const log = (level, message, func) => logger.log(level, message, {file: 'logger.js', func})

async function connect() {
	if (isConnected) return
	await client.connect()
	log('debug', 'successfully connected to database', 'connect()')
	isConnected = true
}

patientRouter.use(fileUpload({
	limits: {fileSize: 50 * 1024 * 1024},
}))

connect()


log('info', `attempting to connect to postgres on ${process.env.DATABASE_URL}`, 'main')

/**
patient schema:
{
	identifier: [{
		use: "usual",
		system: "urn:ietf:rfc:3986",
		value: "database id",
		assigner: "SoN"
	}]
	resourceType: "Patient",
	active: true/false,
	name: [{
		use: "usual",
		text: "Harry James Fitzgerald",
		family: "Fitzgerald",
		given: "Harry",
		prefix: ["Mr"]
	}],
	gender: male/female/other,
	birthDate: "YYYY-MM-DD",
	photo: [{
		contentType: (mimetype of image),
		url: (url of image),
		hash: (b64 hash of image),
	}],
	contact: [{
		name: {
			use: "usual",
			text: "George Keith Brian Fitzgerald",
			family: "Fitzgerald",
			given: "George",
			prefix: ["Dr"]
			telecom: [{
				system: phone, // hardcode
				value: 07555000212, // custom
				use: home/work/other //hardcode
			}]
		}
	}]
}
*/

// ensure that database connection is active
patientRouter.use(async (req, res, next) => {
	await connect()
	next()
})

// debug
patientRouter.get('/all', async (req, res) => {
	log('info', 'attempting to retrieve all patient data', 'GET /all')
	const resp = await client.query('SELECT * FROM patient')
	res.json(resp.rows)
})

// read
patientRouter.get('/:id', async (req, res, next) => {
	const {id} = req.params
	const query = {
		text: 'SELECT * FROM patient WHERE patient_id = $1',
		values: [id],
	}
	log('debug', `retrieving patient with id ${id}`, 'GET /:id')
	const {rows: [patient]} = await client.query(query)
	if (!patient) return next({code: 404, issue: `Patient with "${id}" not found`})
	const {rows: [contact]} = await client.query({
		text: 'SELECT * FROM contact WHERE contact_id = $1',
		values: [patient.contact_id],
	})

	return res.json({
		identifier: [{
			use: 'usual',
			system: 'urn:ietf:rfc:3986',
			value: 'database id',
			assigner: 'SoN',
		}],
		resourceType: 'Patient',
		active: patient.active,
		name: [{
			use: 'usual',
			text: patient.fullname,
			family: patient.family,
			given: patient.given,
			prefix: patient.prefix.split(' '),
		}],
		gender: patient.gender,
		birthDate: 'to-implement',
		photo: [{
			contentType: mimeTypes.lookup(patient.photo_url),
			url: patient.photo_url,
			hash: sha1(fs.readFileSync(patient.photo_url)).toString(),
		}],
		contact: [{
			name: {
				use: 'usual',
				text: contact.fullname,
				family: contact.family,
				given: contact.given,
				prefix: contact.prefix.split(' '),
				telecom: [{
					system: 'phone',
					value: contact.phone,
					use: 'home',
				}],
			},
		}],
	})
})

function validatePayload(body, toValidate, keys, optional = []) {
	const payload = body
	if (!payload) return []
	const missingKeys = keys.filter(key => !(key in payload))
	Object.keys(payload).forEach((key) => {
		if (![...keys, ...optional].includes(key)) delete payload[key]
	})
	return missingKeys.length ? missingKeys : payload
}


// create
patientRouter.post('/', async (req, res) => {
	const rawPatient = {}
	const rawContact = {}
	Object.keys(req.body).forEach((key) => {
		if (key.indexOf('contact') === 0) rawContact[key.replace('contact-', '')] = req.body[key]
		if (key.indexOf('patient') === 0) rawPatient[key.replace('patient-', '')] = req.body[key]
	})

	const patientKeys = ['fullname', 'given', 'prefix', 'gender']
	const contactKeys = ['prefix', 'fullname', 'given', 'phone']
	const patient = validatePayload(rawPatient, 'patient', patientKeys, ['family'])
	const contact = validatePayload(rawContact, 'contact', contactKeys, ['family'])

	// validate everything
	logger.debug('Validating patient', {file: 'src/server/fhir/patient.js', func: 'POST /'})
	if (Array.isArray(patient)) {
		logger.debug(`patient invalid: ${patient}`, {file: 'src/server/fhir/patient.js', func: 'POST /'})
		return createOutcome(req, res, 404, `patient missing following data: ${patient.join(';')}`, {missing: patient})
	}
	logger.debug('Validating contact', {file: 'src/server/fhir/patient.js', func: 'POST /'})
	if (Array.isArray(contact)) {
		logger.debug(`contact invalid: ${contact}`, {file: 'src/server/fhir/patient.js', func: 'POST /'})
		return createOutcome(req, res, 404, `contact missing following data: ${contact.join(';')}`, {missing: contact})
	}
	// we're valid: add to database
	const cQueryBegin = 'INSERT INTO contact ('
	const cQueryCols = Object.keys(contact).join(', ')
	const cQueryJoin = ') VALUES ('
	const cQueryEnd = `${Object.keys(contact).map((_, idx) => `$${idx + 1}`).join(', ')})`
	const cQuery = {
		text: `${cQueryBegin + cQueryCols + cQueryJoin + cQueryEnd} RETURNING contact_id`,
		values: Object.values(contact),
	}

	const {rows: [row]} = await client.query(cQuery)

	Object.assign(patient, {active: true, contact_id: row.contact_id, last_updated: new Date()})

	const file = req.files.profile
	const newPath = path.join(process.cwd(), 'patient', `${patient.given}-${shortid.generate()}-${file.name}`)
	file.mv(newPath)
	patient.photo_url = newPath

	const pQueryBegin = 'INSERT INTO patient ('
	const pQueryCols = Object.keys(patient).join(', ')
	const pQueryJoin = ') VALUES ('
	const pQueryEnd = `${Object.keys(patient).map((_, idx) => `$${idx + 1}`).join(', ')})`

	const pQuery = {
		text: pQueryBegin + pQueryCols + pQueryJoin + pQueryEnd,
		values: Object.values(patient),
	}

	console.log(pQuery)

	const {rows: [pResult]} = await client.query(pQuery)

	return res.json({
		resourceType: 'OperationOutcome',
		issue: [{
			severity: 'success',
			diagnostics: `Patient saved with ID "${pResult.patient_id}"`,
		}],
		expression: [req.originalUrl],
	})
})

// // update
// patientRouter.put('/:id', (req, res) => {

// })

// delete
patientRouter.delete('/:id', async (req, res) => {
	await client.query({
		text: 'DELETE FROM patient where patient_id = $1',
		values: [req.params.id],
	})
	createOutcome(req, res, 200, `deleted ${req.params.id}`)
})

module.exports = patientRouter
