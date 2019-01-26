const {knex} = require('../../db')
const logger = require('../../logger')

class Encounter {
	/**
	 * Wrapper for all fhir encounters
	 * @param {Object} params params used to create Enounter
	 * @param {number} params.encounter_id ID this encounter corresponds to in DB
	 * @param {Date} params.last_updated when this was updated last
	 * @param {string} params.class the type of encounter (generally admission)
	 * @param {number} params.patient_id patient that this encounter corresponds to
	 * @param {number} params.location_id location that this encounter took place in
	 */
	constructor(params = {}) {
		this.encounter_id = params.encounter_id
		this.last_updated = params.last_updated
		this.class = params.class
		this.status = params.status
		this.patient_id = params.patient_id
		this.location_id = params.location_id
		this.meta = {file: 'fhir/classes/Encounter'}
		this.required = [
			'class',
			'status',
			'patient_id',
			'location_id',
			'last_updated',
		]
	}

	/**
	 * Populate the object by ID
	 * @return {Promise<boolean>} Able to populate or not
	 */
	async populate() {
		const {encounter_id} = this
		// use a try-catch so that if there is nothing by ID
		// err is thrown and we can catch/return false
		try {
			const [resp] = await knex('encounter').select().where('encounter_id', encounter_id)
			Object.keys(resp).forEach(key => this[key] = resp[key])
			return true
		} catch (err) {
			logger.error('Unable to populate enconter', {...this.meta, func: 'populate()'})
			logger.error(err, {...this.meta, func: 'populate()'})
			return false
		}
	}

	/**
	 * Adds object params to database
	 * @returns {Promise<boolean>} Added to database or not
	 */
	async insert() {
		this.last_updated = new Date()
		const missingKeys = this.required.filter(key => !this[key])
		if (missingKeys.length) return false
		const insertObj = this.required.reduce((acc, key) => {
			acc[key] = this[key]
			return acc
		}, {})
		try {
			await knex('encounter').insert(insertObj)
			return true
		} catch (err) {
			logger.error('Unable to insert enconter', {...this.meta, func: 'insert()'})
			logger.error(err, {...this.meta, func: 'insert()'})
			return false
		}
	}

	/**
	 * Update database based on object params
	 * @returns {Promise<boolean>} updated or not
	 */
	async update() {
		const exists = this.required.filter(key => this[key])
		const cannotUpdate = exists.length === this.required.length
		if (cannotUpdate) return false
		const obj = this.required.reduce((acc, cur) => {
			if (this[cur]) acc[cur] = this[cur]
			return acc
		}, {})
		obj.last_updated = new Date()
		this.last_updated = obj.last_updated
		try {
			await knex('encounter').update(obj)
			return true
		} catch (err) {
			logger.error('Unable to update enconter', {...this.meta, func: 'update()'})
			logger.error(err, {...this.meta, func: 'update()'})
			return false
		}
	}

	/**
	 * delete based on this.encounter_id
	 * @return {Promise<boolean>} deleted or not
	 */
	async delete() {
		try {
			await knex('encounter').delete().where('encounter_id', this.encounter_id)
			return true
		} catch (err) {
			logger.error('Unable to delete enconter', {...this.meta, func: 'delete()'})
			logger.error(err, {...this.meta, func: 'delete()'})
			return false
		}
	}

	/**
	 * format to fhir spec
	 * @return {object} fhir formatted object
	 */
	fhir() {
		return {
			resourceType: 'Encounter',
			meta: {
				lastUpdated: new Date(this.last_updated),
			},
			status: this.status,
			class: {
				data: this.class,
			},
			subject: {
				reference: `Patient/${this.patient_id}`,
			},
			location: [{
				reference: `Location/${this.location_id}`,
			}],
		}
	}
}

module.exports = Encounter
