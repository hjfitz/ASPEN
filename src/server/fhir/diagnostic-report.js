// All patient observations go here
const express = require('express')

const {client} = require('../db')
const {createOutcome} = require('./util')
const log = require('../logger')
const DiagnosticReport = require('./classes/DiagnosticReport')
const Observation = require('./classes/Observation')

const diagnosticRouter = express.Router()

diagnosticRouter.get('/all', async (req, res) => {
	const {rows} = await client.query('SELECT * FROM diagnostic_report')
	res.json(rows)
})

diagnosticRouter.get('/:id', async (req, res) => {
	const {id} = req.params
	const {rows: [row]} = await client.query({
		text: 'SELECT * FROM diagnostic_report WHERE report_id = $1',
		values: [id],
	})
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
	await client.query({
		name: 'delete-diagnostic-report',
		text: 'DELETE FROM diagnostic_report WHERE report_id = $1',
		values: [id],
	})
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
	const observations = Object.keys(req.body)
		.filter(key => expectedObs.includes(key))
		.map(key => new Observation(key, req.body[key]))
	const queries = observations.map(({query}) => query)

	const idList = (await Promise.all(queries.map(query => client.query(query))))
		.map(resp => resp.rows[0])
		.reduce((acc, cur) => {
			acc[cur.name] = cur.observation_id
			return acc
		}, {})
	const now = new Date()
	const keys = ['last_updated', 'patient_id', ...Object.keys(idList)]
	const rows = keys.join(', ')
	const dolla = keys.map((_, idx) => `$${idx + 1}`).join(', ')
	const query = {
		name: 'create-report',
		text: `INSERT INTO diagnostic_report (${rows}) VALUES (${dolla}) RETURNING report_id`,
		values: [now, patID, ...Object.values(idList)],
	}
	const {rows: [row]} = await client.query(query)
	return createOutcome(req, res, 200, 'successfully added observation', row, 'success')
})


module.exports = diagnosticRouter
