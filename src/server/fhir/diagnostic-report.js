/**
 * All patient observations go here
 */
const express = require('express')

const diagnostic = express.Router()
const observation = express.Router()
const {client} = require('../db')
const {createOutcome} = require('./util')
const log = require('../../../logger')

class Observation {
	constructor(name, value, id, updated = new Date()) {
		this.name = name
		this.value = value
		this.id = `${id}`
		this.updated = updated
		this.unitCode = {
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
			systolic_bp: {
				unit: 'mmHg',
				code: 'mm[Hg]',
			},
			heart_rate: {
				unit: 'beats/min',
				code: '/min',
			},
			level_of_consciousness: {
				unit: '{score}', // https://s.details.loinc.org/LOINC/35088-4.html?sections=Comprehensive
				code: '',
			},
			supplemental_oxygen: {
				unit: '{yes/no}',
				code: '',
			},
		}[name || 'heart_rate']
	}

	get query() {
		log.info(`Creating query for ${this.name}:${this.value}`, {file: 'fhir/diagnostic-report.js', func: 'Observation#query()'})
		return {
			text: 'INSERT INTO observation (last_updated, name, value) VALUES ($1, $2, $3) RETURNING observation_id, name',
			values: [this.updated, this.name, this.value],
		}
	}

	async fhir() {
		const {name, id, value, unitCode, updated} = this
		log.info(`Creating fhir data for ${id}:${name}:${value}`, {file: 'fhir/diagnostic-report.js', func: 'Observation#fhir()'})
		const valueQuantity = Object.assign({value, system: 'http://unitsofmeasure.org'}, unitCode)
		// DIRTY FIX ME PLEAAAASE
		log.debug(`querying database for ${name} = ${id}`)
		const {rows: [row]} = await client.query(`SELECT * FROM diagnostic_report WHERE ${name} = ${id}`)
		return {
			resourceType: 'Observation',
			id,
			meta: {lastUpdated: updated},
			status: 'final',
			subject: {reference: `Diagnostic/${row.report_id}`},
			valueQuantity,
		}
	}
}

class Report {
	constructor(row) {
		// merge keys with our own
		Object.keys(row).forEach((key) => {
			this[key] = row[key]
		})
	}

	fhir() {
		const links = [
			'respiratory_rate',
			'oxygen_saturation',
			'supplemental_oxygen',
			'body_temperature',
			'systolic_bp',
			'heart_rate',
			'level_of_consciousness',
		].map(attr => `Observation/${this[attr]}`)
		return {
			resourceType: 'DiagnosticReport',
			id: this.report_id,
			meta: {
				lastUpdated: this.last_updated,
			},
			subject: `Patient/${this.patient_id}`,
			status: 'final',
			result: links,

		}
	}

	async fhirLinked() {
		const observations = await Promise.all(['respiratory_rate',
			'oxygen_saturation',
			'supplemental_oxygen',
			'body_temperature',
			'systolic_bp',
			'heart_rate',
			'level_of_consciousness',
		].map(attr => client.query({
			text: 'SELECT * FROM observation WHERE observation_id = $1',
			values: [this[attr]]})))

		const values = await Promise.all(observations
			.map(val => val.rows[0])
			.filter(Boolean)
			.map(data => new Observation(data.name, data.value, data.observation_id, data.last_updated))
			.map(obs => obs.fhir()))
		return {
			resourceType: 'DiagnosticReport',
			id: this.report_id,
			meta: {
				lastUpdated: this.last_updated,
			},
			subject: `Patient/${this.patient_id}`,
			status: 'final',
			result: values,

		}
	}
}

observation.get('/all', async (req, res) => {
	const {rows} = await client.query('SELECT * FROM observation')
	const formatted = await Promise.all(
		rows
			.map(row => new Observation(row.name, row.value, row.observation_id, row.last_updated))
			.map(obs => obs.fhir()),
	)
	res.json(formatted)
})

observation.get('/:id', async (req, res) => {
	const {id} = req.params
	const {rows: [row]} = await client.query({
		text: 'SELECT * FROM observation WHERE observation_id = $1',
		values: [id],
	})
	const obs = new Observation(row.name, row.value, row.observation_id, row.last_updated)
	const formatted = await obs.fhir()
	res.json(formatted)
})

diagnostic.get('/all', async (req, res) => {
	const {rows} = await client.query('SELECT * FROM diagnostic_report')
	res.json(rows)
})

diagnostic.get('/:id', async (req, res) => {
	const {id} = req.params
	const {rows: [row]} = await client.query({
		text: 'SELECT * FROM diagnostic_report WHERE report_id = $1',
		values: [id],
	})
	const obs = new Report(row)
	res.json(obs.fhir())
})

diagnostic.get('/:id/linked', async (req, res) => {
	const {id} = req.params
	const {rows: [row]} = await client.query({
		text: 'SELECT * FROM diagnostic_report WHERE report_id = $1',
		values: [id],
	})
	const obs = new Report(row)
	const resp = await obs.fhirLinked()
	res.json(resp)
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
