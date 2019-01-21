// https://www.hl7.org/fhir/patient.html
const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const shortid = require('shortid')
const mimeTypes = require('mime-types')
const sha1 = require('crypto-js/sha1')
const fs = require('fs')

const {createOutcome} = require('./util')
const {client, connect} = require('../db')
const logger = require('../../../logger')

const patientRouter = express.Router()

const log = (level, message, func) => logger.log(level, message, {file: 'logger.js', func})

patientRouter.use(fileUpload({limits: {fileSize: 50 * 1024 * 1024}}))


// ensure that database connection is active
patientRouter.use(async (req, res, next) => connect().then(next))

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
	console.log(req.headers)

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
		name: 'create-contact',
		text: `${cQueryBegin + cQueryCols + cQueryJoin + cQueryEnd} RETURNING contact_id`,
		values: Object.values(contact),
	}

	let row
	try {
		logger.debug(`Attempting to run contact query: ${JSON.stringify(cQuery)}`, {file: 'fhir/patient.js', func: 'POST /'})
		const {rows} = await client.query(cQuery);
		[row] = rows
	} catch (err) {
		logger.warn(`Error with contact query: ${err}`, {file: 'fhir/patient.js', func: 'POST /'})
		return createOutcome(req, res, 400, err, contact)
	}


	Object.assign(patient, {active: true, contact_id: row.contact_id, last_updated: new Date()})

	const file = req.files.profile
	const newPath = path.join(process.cwd(), 'patient', `${patient.given}-${shortid.generate()}-${file.name}`)
	file.mv(newPath)
	patient.photo_url = newPath

	const pQueryBegin = 'INSERT INTO patient ('
	const pQueryCols = Object.keys(patient).join(', ')
	const pQueryJoin = ') VALUES ('
	const pQueryEnd = `${Object.keys(patient).map((_, idx) => `$${idx + 1}`).join(', ')}) RETURNING patient_id`

	const pQuery = {
		name: 'create patient',
		text: pQueryBegin + pQueryCols + pQueryJoin + pQueryEnd,
		values: Object.values(patient),
	}

	let pResult
	try {
		logger.debug(`Attempting to run query patient: ${JSON.stringify(pQuery)}`, {file: 'fhir/patient.js', func: 'POST /'})
		const {rows} = await client.query(pQuery);
		[pResult] = rows
	} catch (err) {
		logger.warn(`Error with patient query: ${err}`, {file: 'fhir/patient.js', func: 'POST /'})
		return createOutcome(req, res, 400, err, JSON.stringify(pQuery))
	}

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
patientRouter.put('/:id', async (req, res) => {
	logger.info(`Updating patient ${req.params.id}`, {file: 'fhir/patient.js', func: 'PUT /:id'})
	const patientKeys = ['active', 'fullname', 'given', 'family', 'prefix', 'gender', 'photo_url']
	// create an object to enable us to create an update query
	const patient = Object.keys(req.body).reduce((acc, key) => {
		const newKey = key.replace('patient-', '')
		if (key.indexOf('patient-') === 0 && patientKeys.includes(newKey)) {
			acc[newKey] = req.body[key]
		}
		return acc
	}, {})

	// create a query with only the expected fields
	const query = {
		name: 'update-patient',
		text: `UPDATE patient SET (${
			Object.keys(patient).join(', ') // rows
		}) = (${
			Object.keys(patient).map((_, idx) => `$${idx + 1}`).join(', ') // make it a prepared statement
		}) WHERE patient_id = $${Object.keys(patient).length + 1}`,
		values: [...Object.values(patient), req.params.id],
	}
	await client.query(query)
	createOutcome(req, res, 200, 'Updated patient', {}, 'success')
})

// delete
patientRouter.delete('/:id', async (req, res) => {
	await client.query({
		name: 'delete-patient',
		text: 'DELETE FROM patient where patient_id = $1',
		values: [req.params.id],
	})
	createOutcome(req, res, 200, `deleted ${req.params.id}`)
})

module.exports = patientRouter
