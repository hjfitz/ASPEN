// All patient observations go here
const diagnosticRouter = require('express').Router()

const {knex} = require('../db')
const {createOutcome} = require('./util')
const log = require('../logger')
const DiagnosticReport = require('./classes/DiagnosticReport')
const Observation = require('./classes/Observation')


// yet documented in swagger
diagnosticRouter.get('/', async (req, res) => {
	const {
		patient: patient_id,	// patient ID
		result,					// link results (bool)
		_count,					// number of reports to send
		page,					// which page of results
	} = req.query
	const offset = _count * page
	const rows = await knex('diagnostic_report')
		.select()
		.where({patient_id})
		.limit(_count)
		.offset(offset)


	const reports = await Promise.all(
		rows
			.map(row => new DiagnosticReport(row))
			.sort((a, b) => {
				const aDate = new Date(a.last_updated)
				const bDate = new Date(b.last_updated)
				if (aDate > bDate) return -1
				if (aDate < bDate) return 1
				return 0
			})
			.map((report) => {
				if (result) return report.fhirLinked()
				return Promise.resolve(report.fhir())
			}),
	)
	res.json(reports)
})

diagnosticRouter.get('/all', async (req, res) => {
	const rows = await knex('diagnostic_report').select()
	res.json(rows)
})

diagnosticRouter.get('/:id', async (req, res) => {
	const {id} = req.params
	const [row] = await knex('diagnostic_report').select().where({report_id: id})
	const obs = new DiagnosticReport(row)
	let resp = obs.fhir()
	if (req.query.result) {
		resp = await obs.fhirLinked()
	}
	res.json(resp)
})


diagnosticRouter.delete('/:id', async (req, res) => {
	const {id} = req.params
	log.debug(`attempting to delete ${id} from diagnostic_report`, {file: 'fhir/diagnostic-report.js', func: 'DELETE /:id'})
	await knex('diagnostic_report').where({report_id: id}).del()
	createOutcome(req, res, 200, 'Successfully deleted', {}, 'success')
})

diagnosticRouter.post('/', async (req, res) => {
	const expectedObs = [
		'respiratory_rate',
		'oxygen_saturation',
		'supplemental_oxygen',
		'body_temperature',
		'systolic_bp',
		'heart_rate',
		'level_of_consciousness',
		'patient_id',
	]
	const validRequest = expectedObs.filter(obs => !(obs in req.body))
	if (validRequest.length) return createOutcome(req, res, 400, 'Missing data', validRequest)
	const patID = req.body.patient_id
	delete req.body.patient_id
	const observations = await Promise.all(
		Object.keys(req.body)
			.filter(key => expectedObs.includes(key))
			.map(key => new Observation(key, req.body[key]).insert()),
	)

	const idList = observations
		.map(obs => obs[0])
		.reduce((acc, obs) => {
			acc[obs.name] = obs.observation_id
			return acc
		}, {})

	const [row] = await knex('diagnostic_report').insert({
		...idList,
		last_updated: new Date(),
		patient_id: patID,
	}).returning(['report_id'])
	return createOutcome(req, res, 200, 'successfully added observation', row, 'success')
})


module.exports = diagnosticRouter
