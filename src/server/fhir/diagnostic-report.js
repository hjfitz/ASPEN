/**
 * All patient observations go here
 */
const express = require('express')

const diagnostic = express.Router()
const observation = express.Router()
const {client, connect} = require('../db')
const {createOutcome} = require('./util')

class Observation {
	constructor(name, value, id, updated = new Date()) {
		this.name = name
		this.value = value
		this.id = `${id}`
		this.updated = updated
		this.units = {
			respiratory_rate: {
				unit: 'breaths/minute',
				code: '/min',
			},
			oxygen_saturation: {
				unit: '%',
				code: '%',
			},
			body_temperature: {
				unit: 'C',
				code: 'cel',
			},
		}[name || 'heart_rate']
	}

	get query() {
		return {
			text: 'INSERT INTO observation (last_updated, name, value) VALUES ($1, $2, $3) RETURNING observation_id, name',
			values: [this.updated, this.name, this.value],
		}
	}

	async fhir() {
		const {name, id, value, unit} = this
		// DIRTY FIX ME PLEAAAASE
		const {rows: [row]} = await client.query(`SELECT * FROM diagnostic_report WHERE ${name} = ${id}`)
		console.log(row)
		return {
			resourceType: 'Observation',
			id: this.id,
			meta: {
				lastUpdated: this.updated,
			},
			status: 'final',
			subject: {
				reference: `Diagnostic/${row.report_id}`,
			},
			valueQuantity: {
				value,
				unit,
				system: 'http://unitsofmeasure.org',
			},
		}
	}
}

observation.get('/all', async (req, res) => {
	const {rows} = await client.query('SELECT * FROM observation')
	res.json(rows)
})

observation.get('/:id', async (req, res) => {
	const {id} = req.params
	const {rows: [row]} = await client.query({
		text: 'SELECT * FROM observation WHERE observation_id = $1',
		values: [id],
	})
	const obs = new Observation(row.name, row.value, row.observation_id, row.last_updated)
	await obs.fhir()
	res.json(row)
})

diagnostic.get('/all', async (req, res) => {
	const {rows} = await client.query('SELECT * FROM diagnostic_report')
	res.json(rows)
})

diagnostic.post('/', async (req, res) => {
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


module.exports = {diagnostic, observation}
