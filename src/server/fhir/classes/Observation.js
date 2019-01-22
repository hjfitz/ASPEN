const log = require('../../logger')
const client = require('../../db')

module.exports = class Observation {
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
		log.info(`Creating query for ${this.name}:${this.value}`, {file: 'fhir/classes/Observation.js', func: 'Observation#query()'})
		return {
			text: 'INSERT INTO observation (last_updated, name, value) VALUES ($1, $2, $3) RETURNING observation_id, name',
			values: [this.updated, this.name, this.value],
		}
	}

	async fhir() {
		const {name, id, value, unitCode, updated} = this
		log.info(`Creating fhir data for ${id}:${name}:${value}`, {file: 'fhir/classes/Observation.js', func: 'Observation#fhir()'})
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
