// https://www.hl7.org/fhir/patient.html
const express = require('express')
const OperationOutcome = require('./classes/OperationOutcome')
const Patient = require('./classes/Patient')
const Contact = require('./classes/Contact')
const logger = require('../logger')
const {client, knex} = require('../db')

const patientRouter = express.Router()

const log = (level, message, func) => logger.log(level, message, {file: 'logger.js', func})

// used for debugging. removed in production
patientRouter.get('/all', async (req, res) => {
	log('info', 'attempting to retrieve all patient data', 'GET /all')
	const resp = await client.query('SELECT * FROM patient')
	res.json(resp.rows)
})

// read a specific patient
patientRouter.get('/:id', async (req, res) => {
	const {id} = req.params
	// create a new patient and send.
	const patient = new Patient({id})
	const populated = await patient.populate()
	if (populated) {
		const fhir = await patient.fhir()
		return res.json(fhir)
	}
	// patient not populated? let the user know
	const outcome = new OperationOutcome('error', 406, req.originalUrl, 'could not find patient')
	return outcome.makeResponse(res)
})

patientRouter.get('/', async (req, res) => {
	const {_query} = req.query
	// handle searches and Bundle requests for all
	if (_query) {
		const rows = await knex('patient')
			.where('fullname', 'ilike', _query)
			.orWhere('given', 'ilike', _query)
			.orWhere('family', 'ilike', _query)
		const mapped = await Promise.all(
			rows.map(row => new Patient({...row, id: row.patient_id}).fhir()),
		)
		res.json(mapped)
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
	const rawPatient = {}
	const rawContact = {}
	Object.keys(req.body).forEach((key) => {
		if (key.indexOf('contact') === 0) rawContact[key.replace('contact-', '')] = req.body[key]
		if (key.indexOf('patient') === 0) rawPatient[key.replace('patient-', '')] = req.body[key]
	})
	const photo = (req.files && req.files['patient-photo']) ? req.files['patient-photo'] : {}
	const patient = new Patient({...rawPatient, photo, active: true})
	const contact = new Contact(rawContact)
	const cResp = await contact.insert()
	if (!cResp) {
		logger.debug('Unable to create contact', meta)
		const outcome = new OperationOutcome('error', 406, req.originalUrl, 'Unable to insert contact')
		return outcome.makeResponse(res)
	}
	logger.debug('created contact', meta)
	patient.contact_id = cResp.contact_id
	const pResp = await patient.insert()
	if (!pResp) {
		const outcome = new OperationOutcome('error', 406, req.originalUrl, 'Unable to insert patient')
		return outcome.makeResponse(res)
	}
	const outcome = new OperationOutcome('success', 200, req.originalUrl, 'success', pResp)
	return outcome.makeResponse(res)
})

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
