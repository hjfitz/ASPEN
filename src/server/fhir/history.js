const historyRouter = require('express').Router()
const OperationOutcome = require('./classes/OperationOutcome')
const {knex} = require('../db')


historyRouter.get('/:id', async (req, res) => {
	const [row] = await knex('patient_history').select().where({patient_id: req.params.id})
	if (row) {
		const [practitioner] = await knex('practitioner').select().where({practitioner_id: row.sign_off_userid})
		res.json({...row, ...practitioner})
	} else {
		const outcome = new OperationOutcome('error', 404, req.originalUrl, 'unable to find history')
		outcome.makeResponse(res)
	}
})

historyRouter.post('/', async (req, res) => {
	try {
		const resp = await knex('patient_history').insert(req.body)
		const outcome = new OperationOutcome('success', 200, req.url, 'Successfully added history', resp)
		return outcome.makeResponse(res)
	} catch (err) {
		const outcome = new OperationOutcome('error', 500, req.url, err)
		return outcome.makeResponse(res)
	}
})

module.exports = historyRouter
