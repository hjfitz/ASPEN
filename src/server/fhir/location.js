// primarily used for ward management
const express = require('express')
const Location = require('./classes/Location')
const logger = require('../logger')
const {createOutcome} = require('./util')
const {client} = require('../db')

const locRouter = express.Router()

locRouter.post('/', async (req, res) => {
	// metadata for easy logging
	const meta = {file: 'fhir/location.js', func: 'POST /'}

	// pull out only the information we need to make a query
	const {name, description, type} = req.body
	logger.debug(`recieved name: ${name}; description: ${description}; type: ${type}`, meta)
	const loc = new Location({name, description, type})
	const {query} = loc
	// no query? Must be an error with their request
	if (!query) return createOutcome(req, res, 400, 'Error with query!', {name, description, type}, 'error')
	logger.debug(`Query valid: ${JSON.stringify(query)}`, meta)

	// attempt to put this data in to the database
	try {
		const {rows: [row]} = await client.query(query)
		logger.debug('data added to database successfully', meta)
		return createOutcome(req, res, 200, 'success!', {id: row.location_id})
	} catch (err) {
		logger.error(`Error when inserting new location: ${err}`, meta)
		return createOutcome(req, res, 500, err, {}, 'error')
	}
})

locRouter.get('/:id', async (req, res) => {
	// prepare and make a query to get data
	const {rows: [row]} = await client.query({
		name: 'get-location',
		text: 'SELECT * FROM location WHERE location_id = $1;',
		values: [req.params.id],
	})

	// create a location with the database data, format it correctly
	const location = new Location(row)
	res.json(location.getFhir())
})

module.exports = locRouter
