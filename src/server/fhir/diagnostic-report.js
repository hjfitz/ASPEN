// All patient observations go here
const diagnosticRouter = require('express').Router()

const {knex} = require('../db')
const {createOutcome} = require('./util')
const log = require('../logger')
const DiagnosticReport = require('./classes/DiagnosticReport')
const Observation = require('./classes/Observation')
const OperationOutcome = require('./classes/OperationOutcome')


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
	// make sure that all observations have a value and name
	const hasAllObservations = req.body.result.filter(observation => ('value' in observation.valueQuantity) && ('text' in observation.code))
	// no name or value? return 406
	if (hasAllObservations.length !== req.body.result.length) {
		const outcome = new OperationOutcome('error', 406, req.url, 'missing observations!', {})
		return outcome.makeResponse(res)
	}

	const observations = await Promise.all(
		req.body.result.map(
			({code, valueQuantity}) => new Observation(code.text, valueQuantity.value).insert(),
		),
	)

	const idList = {}
	observations.flat().forEach(({name, observation_id}) => idList[name] = observation_id)

	const [row] = await knex('diagnostic_report').insert({
		...idList,
		last_updated: req.body.meta.last_updated,
		patient_id: req.body.subject.replace('Patient/', ''),
	}).returning(['report_id'])
	return createOutcome(req, res, 200, 'successfully added observation', row, 'success')
})

module.exports = diagnosticRouter
