// primarily used for ward management
const locRouter = require('express').Router()
const Location = require('./classes/Location')
const OperationOutcome = require('./classes/OperationOutcome')
const logger = require('../logger')
const {createOutcome} = require('./util')
const {knex} = require('../db')

locRouter.post('/', async (req, res) => {
	// metadata for easy logging
	const meta = {file: 'fhir/location.js', func: 'POST /'}

	// pull out only the information we need to make a query
	const {name, description, type} = req.body
	logger.debug(`recieved name: ${name}; description: ${description}; type: ${type}`, meta)
	const loc = new Location({name, description, type})

	try {
		const resp = await loc.insert()
		if (!resp) return createOutcome(req, res, 400, 'Error with query!', {name, description, type}, 'error')
		logger.debug('data added to database successfully', meta)
		const outcome = new OperationOutcome('success', 200, req.originalUrl, 'Successfully created location', {id: resp})
		return outcome.makeResponse(res)
	} catch (err) {
		logger.error(`Error when inserting new location: ${err}`, meta)
		const outcome = new OperationOutcome('error', 500, req.originalUrl, 'Error creating location', {err})
		return outcome.makeResponse(res)
	}
})

locRouter.get('/', async (req, res) => {
	const {type} = req.query
	// ensure that requests specify location type
	if (!type) {
		const outcome = new OperationOutcome('warn', 404, req.originalUrl, 'Incorrect query param')
		return outcome.makeResponse(res)
	}
	// pull from database
	const resp = await knex('location').select().where({type})
	const payload = resp.map(entry => new Location({id: entry.location_id, ...entry}).fhir())
	return res.json(payload)
})

locRouter.get('/:id', async (req, res) => {
<<<<<<< HEAD
	const location = new Location({id: req.params.id})
	await location.populate()
	res.json(location.getFhir())
=======
	// prepare and make a query to get data
	const {rows: [row]} = await client.query({
		name: 'get-location',
		text: 'SELECT * FROM location WHERE location_id = $1;',
		values: [req.params.id],
	})

	// create a location with the database data, format it correctly
	const location = new Location(row)
	res.json(location.fhir())
>>>>>>> develop
})

locRouter.delete('/:id', async (req, res) => {
	const meta = {file: 'fhir/location.js', func: 'DELETE /:id'}
	try {
		const location = new Location({id: req.params.id})
		await location.delete()
		logger.debug(`Attempting to delete location with ID ${req.params.id}`, meta)
		const outcome = new OperationOutcome('information', 200, req.originalUrl, 'successfully deleted')
		outcome.makeResponse(res)
	} catch (err) {
		logger.error(`Unable to delete by ID ${req.params.id}`, meta)
		logger.error(`Error: ${err}`, meta)
		const outcome = new OperationOutcome('error', 500, req.originalUrl, 'Error deleting location!', {err})
		outcome.makeResponse(res)
	}
})

module.exports = locRouter
