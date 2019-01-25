const observationRouter = require('express').Router()
const {client} = require('../db')
const Observation = require('./classes/Observation')


observationRouter.get('/all', async (req, res) => {
	const {rows} = await client.query('SELECT * FROM observation')
	const formatted = await Promise.all(
		rows
			.map(row => new Observation(row.name, row.value, row.observation_id, row.last_updated))
			.map(obs => obs.fhir()),
	)
	res.json(formatted)
})

observationRouter.get('/:id', async (req, res) => {
	const {id} = req.params
	const {rows: [row]} = await client.query({
		text: 'SELECT * FROM observation WHERE observation_id = $1',
		values: [id],
	})
	const obs = new Observation(row.name, row.value, row.observation_id, row.last_updated)
	const formatted = await obs.fhir()
	res.json(formatted)
})


module.exports = observationRouter
