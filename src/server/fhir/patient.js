// https://www.hl7.org/fhir/patient.html
const express = require('express')
const OperationOutcome = require('./classes/OperationOutcome')
const Patient = require('./classes/Patient')
const Contact = require('./classes/Contact')
const logger = require('../logger')
const {knex} = require('../db')

const patientRouter = express.Router()

const log = (level, message, func) => logger.log(level, message, {file: 'logger.js', func})

// debug
patientRouter.get('/all', async (req, res) => {
	log('info', 'attempting to retrieve all patient data', 'GET /all')
	const rows = await knex('patient').select()
	res.json(rows)
})

// read
patientRouter.get('/:id', async (req, res) => {
	const {id} = req.params
	const patient = new Patient({id})
	const populated = await patient.populate()
	if (populated) {
		const fhir = await patient.fhir()
		return res.json(fhir)
	}
	const outcome = new OperationOutcome('error', 406, req.originalUrl, 'could not find patient')
	return outcome.makeResponse(res)
})

patientRouter.get('/', async (req, res) => {
	const {_query} = req.query
	// handle searches and Bundle requests for all
	if (_query) {
		const nestedRows = await knex('patient').whereRaw('fullname Ilike ?', [`%${_query}%`])
		const mapped = await Promise.all(
			nestedRows.map(row => new Patient({...row, id: row.patient_id}).fhir()),
		)
		res.json(mapped)
		return
	}
	const rows = await knex('patient')
	const patients = await Promise.all(rows.map(row => new Patient({id: row.patient_id}).fhir()))
	const resp = patients.map(patient => ({
		url: `/fhir/Patient/${patient.id}`,
		...patient,
	}))
	res.json({
		resourceType: 'Bundle',
		meta: {
			lastUpdated: new Date(),
		},
		type: 'searchset',
		entry: resp,
	})
})

// create
patientRouter.post('/', async (req, res) => {
	const meta = {file: 'fhir/patient.js', func: 'POST /'}
	// const {active, id, fullname, given, prefix, gender, last_updated, photo, family} = params

	const patient = new Patient({
		active: req.body.active,
		fullname: req.body.name[0].family,
		given: req.body.name[0].given,
		prefix: req.body.name[0].prefix,
		gender: req.body.gender,
		last_updated: new Date(),
		photo: req.body.photo,
		family: req.body.name[0].family,
	})

	const contact = new Contact({
		prefix: req.body.contact[0].name.prefix,
		fullname: req.body.contact[0].name.family,
		given: req.body.contact[0].name.given,
		phone: req.body.contact[0].telecom[0].value,
		family: req.body.contact[0].name.family,
	})

	// attempt to insert contact. if that succeeds, insert patient
	const row = await contact.insert()
	console.log(row)
	if (!row) {
		// couldn't succeed? return bad outcome
		logger.debug('Unable to create contact', meta)
		const outcome = new OperationOutcome('error', 406, req.originalUrl, 'Unable to insert contact')
		return outcome.makeResponse(res)
	}
	patient.contact_id = row.contact_id
	logger.debug('created contact', meta)
	const patientRow = await patient.insert()
	const outcome = patientRow
		? new OperationOutcome('success', 200, req.originalUrl, 'success', patientRow)
		: new OperationOutcome('error', 406, req.originalUrl, 'Unable to insert patient')
	return outcome.makeResponse(res)
})

// patientRouter.post('/', async (req, res) => {
// 	const meta = {file: 'fhir/patient.js', func: 'POST /'}
// 	const rawPatient = {}
// 	const rawContact = {}
// 	Object.keys(req.body).forEach((key) => {
// 		if (key.indexOf('contact') === 0) rawContact[key.replace('contact-', '')] = req.body[key]
// 		if (key.indexOf('patient') === 0) rawPatient[key.replace('patient-', '')] = req.body[key]
// 	})
// 	const photo = (req.files && req.files['patient-photo']) ? req.files['patient-photo'] : {}
// 	const patient = new Patient({...rawPatient, photo, active: true})
// 	const contact = new Contact(rawContact)
// 	const cResp = await contact.insert()
// 	if (!cResp) {
// 		logger.debug('Unable to create contact', meta)
// 		const outcome = new OperationOutcome('error', 406, req.originalUrl, 'Unable to insert contact')
// 		return outcome.makeResponse(res)
// 	}
// 	logger.debug('created contact', meta)
// 	patient.contact_id = cResp.contact_id
// 	const pResp = await patient.insert()
// 	if (!pResp) {
// 		const outcome = new OperationOutcome('error', 406, req.originalUrl, 'Unable to insert patient')
// 		return outcome.makeResponse(res)
// 	}
// 	const outcome = new OperationOutcome('success', 200, req.originalUrl, 'success', pResp)
// 	return outcome.makeResponse(res)
// })

// update
patientRouter.put('/:id', async (req, res) => {
	logger.info(`Updating patient ${req.params.id}`, {file: 'fhir/patient.js', func: 'PUT /:id'})
	const patientKeys = ['active', 'fullname', 'given', 'family', 'prefix', 'gender', 'photo_url']
	// create an object to enable us to create an update query
	const rawPatient = Object.keys(req.body).reduce((acc, key) => {
		const newKey = key.replace('patient-', '')
		if (key.indexOf('patient-') === 0 && patientKeys.includes(newKey)) {
			acc[newKey] = req.body[key]
		}
		return acc
	}, {})

	const patient = new Patient({...rawPatient, id: req.params.id})
	const updated = await patient.update()
	let outcome = new OperationOutcome('success', 200, req.originalUrl, 'success updating')
	if (!updated) outcome = new OperationOutcome('warn', 406, req.originalUrl, 'Unable to update patient')
	outcome.makeResponse(res)
})

// delete
patientRouter.delete('/:id', async (req, res) => {
	const {id} = req.params
	const patient = new Patient({id})
	const resp = await patient.delete()
	let outcome = new OperationOutcome('success', 200, req.originalUrl, resp.msg)
	if (!resp.deleted) outcome = new OperationOutcome('error', 406, req.originalUrl, resp.msg.detail)
	outcome.makeResponse(res)
})

module.exports = patientRouter
