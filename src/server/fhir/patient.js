// https://www.hl7.org/fhir/patient.html
const express = require('express')
const path = require('path')
const shortid = require('shortid')
const mimeTypes = require('mime-types')
const sha1 = require('crypto-js/sha1')
const fs = require('fs')
const Patient = require('./classes/Patient')
const Contact = require('./classes/Contact')
const OperationOutcome = require('./classes/OperationOutcome')

const {createOutcome} = require('./util')
const {client} = require('../db')
const logger = require('../logger')

const patientRouter = express.Router()

const log = (level, message, func) => logger.log(level, message, {file: 'logger.js', func})

// debug
patientRouter.get('/all', async (req, res) => {
	log('info', 'attempting to retrieve all patient data', 'GET /all')
	const resp = await client.query('SELECT * FROM patient')
	res.json(resp.rows)
})

// read
patientRouter.get('/:id', async (req, res, next) => {
	const {id} = req.params
	const patient = new Patient({id})
	await patient.populate()

	res.send(200)
	// const query = {
	// 	text: 'SELECT * FROM patient WHERE patient_id = $1',
	// 	values: [id],
	// }
	// log('debug', `retrieving patient with id ${id}`, 'GET /:id')
	// const {rows: [patient]} = await client.query(query)
	// if (!patient) return next({code: 404, issue: `Patient with "${id}" not found`})
	// const {rows: [contact]} = await client.query({
	// 	text: 'SELECT * FROM contact WHERE contact_id = $1',
	// 	values: [patient.contact_id],
	// })

	// return res.json({
	// 	identifier: [{
	// 		use: 'usual',
	// 		system: 'urn:ietf:rfc:3986',
	// 		value: 'database id',
	// 		assigner: 'SoN',
	// 	}],
	// 	resourceType: 'Patient',
	// 	active: patient.active,
	// 	name: [{
	// 		use: 'usual',
	// 		text: patient.fullname,
	// 		family: patient.family,
	// 		given: patient.given,
	// 		prefix: patient.prefix.split(' '),
	// 	}],
	// 	gender: patient.gender,
	// 	birthDate: 'to-implement',
	// 	photo: [{
	// 		contentType: mimeTypes.lookup(patient.photo_url),
	// 		url: patient.photo_url,
	// 		hash: sha1(fs.readFileSync(patient.photo_url)).toString(),
	// 	}],
	// 	contact: [{
	// 		name: {
	// 			use: 'usual',
	// 			text: contact.fullname,
	// 			family: contact.family,
	// 			given: contact.given,
	// 			prefix: contact.prefix.split(' '),
	// 			telecom: [{
	// 				system: 'phone',
	// 				value: contact.phone,
	// 				use: 'home',
	// 			}],
	// 		},
	// 	}],
	// })
})

// create
patientRouter.post('/', async (req, res) => {
	const rawPatient = {}
	const rawContact = {}
	Object.keys(req.body).forEach((key) => {
		if (key.indexOf('contact') === 0) rawContact[key.replace('contact-', '')] = req.body[key]
		if (key.indexOf('patient') === 0) rawPatient[key.replace('patient-', '')] = req.body[key]
	})
	const patient = new Patient(rawPatient)
	const contact = new Contact(rawContact)
	const cResp = await contact.insert()
	if (!cResp) {
		const outcome = new OperationOutcome('error', 406, req.originalUrl, 'Unable to insert contact')
		return outcome.makeResponse(res)
	}
	patient.contact_id = cResp.contact_id
	const pResp = await patient.insert()
	if (!pResp) {
		const outcome = new OperationOutcome('error', 406, req.originalUrl, 'Unable to insert patient')
		return outcome.makeResponse(res)
	}
	const outcome = new OperationOutcome('success', 200, req.originalUrl, 'success')
	return outcome.makeResponse(res)
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
