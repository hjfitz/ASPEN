const encounterRouter = require('express').Router()
const {knex} = require('../db')
const Encounter = require('./classes/Encounter')
const OperationOutcome = require('./classes/OperationOutcome')

encounterRouter.post('/', async (req, res) => {
	const enc = new Encounter(req.body)
	const inserted = await enc.insert()
	const outcome = inserted
		? new OperationOutcome('success', 200, req.originalUrl, 'Successfully added encounter')
		: new OperationOutcome('error', 406, req.originalUrl, 'Unable to add encounter')
	outcome.makeResponse(res)
})

encounterRouter.get('/all', async (req, res) => {
	const rows = await knex('encounter').select()
	res.json(rows)
})

encounterRouter.get('/', async (req, res) => {
	const include = req.query._include
	delete req.query._include
	const [, ...tail] = include.split(':')
	const toInclude = tail.join(':').split(';').reduce((acc, cur) => {
		acc[cur] = true
		return acc
	}, {})
	const rows = await knex('encounter').select().where(req.query)
	const mapped = await Promise.all(rows.map(row => new Encounter(row).fhir(toInclude)))
	res.json(mapped)
	// res.json(rows)
})

encounterRouter.get('/:encounter_id', async (req, res) => {
	const {encounter_id} = req.params
	const enc = new Encounter({encounter_id})
	const populated = await enc.populate()
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
