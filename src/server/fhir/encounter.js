const encounterRouter = require('express').Router()
const {knex} = require('../db')
const {decodeJWTPayload} = require('../auth/token')
const Encounter = require('./classes/Encounter')
const OperationOutcome = require('./classes/OperationOutcome')

/**
 * Handle all encoutners:
 * 	required as FHIR offers no logical way to store patients
 */

/**
  * Accept a new ancounter
  */
encounterRouter.post('/', async (req, res) => {
	const enc = new Encounter(req.body)
	// attempt to insert the data.
	// inserted will be false if req.body does not have the required fields
	const inserted = await enc.insert()
	const outcome = inserted
		? new OperationOutcome('success', 200, req.originalUrl, 'Successfully added encounter')
		: new OperationOutcome('error', 406, req.originalUrl, 'Unable to add encounter')
	outcome.makeResponse(res)
})


/**
 * find a new encounter
 * this required the practitioner to have view:allpatients to view all
 * else will fall back to practitionerpatients in table
 */
encounterRouter.get('/', async (req, res) => {
	const decodedToken = decodeJWTPayload(req.headers.token)

	// remove _include as we can use knex to search.where(req.query)
	const include = req.query._include
	delete req.query._include

	// queryparams may have _include=patient;encounter
	// split these in to an object so the fhir() method on encounter can populate
	const [, ...tail] = include.split(':')
	const toInclude = tail.join(':').split(';').reduce((acc, cur) => {
		acc[cur] = true
		return acc
	}, {})

	// pull all encounters based on the querystring
	const rows = await knex('encounter').select().where(req.query)

	// if no permission to view all:
	// select all from union table and filter out based on practitonerpatients
	if (!decodedToken.permissions.includes('view:allpatients')) {
		const unionTable = await knex('practitionerpatients')
			.select()
			.where({practitioner_id: decodedToken.userid})

		// map to patient ID and remove them from the earlier rows set
		const patientIDs = unionTable.map(group => group.patient_id)

		// use promise.all to 'concurrently' access the database
		const mapped = await Promise.all(rows
			.filter(row => patientIDs.includes(row.patient_id))
			.map(row => new Encounter(row).fhir(toInclude)))
		res.json(mapped)
		return
	}

	// the user has all permissions, populate these and send to user
	const mapped = await Promise.all(
		rows.map(row => new Encounter(row).fhir(toInclude)),
	)
	res.json(mapped)
})

// get an encounter based on the encounter ID (GET /fhir/Encounter/1)
encounterRouter.get('/:encounter_id', async (req, res) => {
	const {encounter_id} = req.params
	const enc = new Encounter({encounter_id})
	const populated = await enc.populate()
	// check if the encounter was found
	if (!populated) {
		const outcome = new OperationOutcome('error', 404, req.originalUrl, 'Unable to find encounter')
		return outcome.makeResponse(res)
	}
	return res.json(enc.fhir())
})

encounterRouter.put('/:encounter_id', async (req, res) => {
	const {encounter_id} = req.params
	const enc = new Encounter({...req.body, encounter_id})
	const updated = await enc.update()
	const outcome = updated
		? new OperationOutcome('success', 200, req.originalUrl, 'Successfully updated encounter')
		: new OperationOutcome('error', 406, req.originalUrl, 'Unable to update encounter')
	outcome.makeResponse(res)
})

encounterRouter.delete('/:encounter_id', async (req, res) => {
	const {encounter_id} = req.params
	const enc = new Encounter({encounter_id})
	const deleted = await enc.delete()
	const outcome = deleted
		? new OperationOutcome('success', 200, req.originalUrl, 'Successfully deleted encounter')
		: new OperationOutcome('error', 406, req.originalUrl, 'Unable to remove encounter')
	outcome.makeResponse(res)
})


module.exports = encounterRouter
