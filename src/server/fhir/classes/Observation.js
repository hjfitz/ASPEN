const log = require('../../logger')
const {client} = require('../../db')

class Observation {
	/**
	 * FHIR wrapper for Observation data
	 * @param {string} name Name of observation (blood pressure/respiratory rate etc)
	 * @param {string} value Value (what was recorded)
	 * @param {number} id DB ID of the Observation
	 * @param {boolean} updated Then the resource was last updated
	 */
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

	/**
	 * Generates a query for inserting data in to database (uses node-pg structured queries for now)
	 * TODO: Update this to knex
	 * @returns {object} node-pg query
	 */
	get query() {
		log.info(`Creating query for ${this.name}:${this.value}`, {file: 'fhir/classes/Observation.js', func: 'Observation#query()'})
		return {
			text: 'INSERT INTO observation (last_updated, name, value) VALUES ($1, $2, $3) RETURNING observation_id, name',
			values: [this.updated, this.name, this.value],
		}
	}

	/**
	 * Format the observation data to fhir data
	 * @returns {object} fhir formatted observation data
	 */
	async fhir() {
		const {name, id, value, unitCode, updated} = this
		log.info(`Creating fhir data for ${id}:${name}:${value}`, {file: 'fhir/classes/Observation.js', func: 'Observation#fhir()'})
		const valueQuantity = Object.assign({value, system: 'http://unitsofmeasure.org'}, unitCode)
		log.debug(`querying database for ${name} = ${id}`, {file: 'fhir/classes/Observation.js', func: 'Observation#fhir()'})
		// DIRTY FIX ME PLEAAAASE
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

module.exports = Observation
