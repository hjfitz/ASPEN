const observationRouter = require('express').Router()
const {knex} = require('../db')
const Observation = require('./classes/Observation')


observationRouter.get('/all', async (req, res) => {
	const rows = await knex('observation').select()
	const formatted = await Promise.all(
		rows
			.map(row => new Observation(row.name, row.value, row.observation_id, row.last_updated))
			.map(obs => obs.fhir()),
	)
	res.json(formatted)
})

observationRouter.get('/:id', async (req, res) => {
	const {id} = req.params
	const [row] = await knex('observation').select().where({observation_id: id})
	const obs = new Observation(row.name, row.value, row.observation_id, row.last_updated)
	const formatted = await obs.fhir()
	res.json(formatted)
})


module.exports = observationRouter
