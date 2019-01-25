const logger = require('../../logger')
const {client, knex} = require('../../db')

class Patient {
	constructor(params) {
		const {active, id, fullname, given, prefix, gender, last_updated, photo_url, family} = params
		this.active = active === undefined ? true : active
		this.loaded = false
		this.id = id
		this.fullname = fullname
		this.given = given
		this.prefix = prefix
		this.gender = gender
		this.last_updated = last_updated
		this.photo_url = photo_url
		this.family = family
		this.meta = {file: 'fhir/classes/Patient.js'}
		this.required = ['active', 'fullname', 'given', 'prefix', 'gender', 'contact_id']
		this.values = [...this.required, 'photo_url', 'family', 'last_updated']
	}

	async fetch() {
		const {meta, id} = this
		if (!this.id) return logger.warn('Attempted to fetch without ID', meta)
		const {rows: [row]} = await client.query({
			name: 'fetch-patient',
			text: 'SELECT * FROM patient WHERE patient_id = $1',
			values: [id],
		})
		this.active = row.active
		this.fullname = row.fullname
		this.given = row.given
		this.prefix = row.prefix
		this.gender = row.gender
		this.last_updated = row.last_updated
		this.photo_url = row.photo_url
		this.family = row.family
		this.contact_id = row.contact_id
		this.loaded = true
	}

	async populate() {
		const {meta, id} = this
		console.log(id)
		if (id) {
			const [resp] = await knex('patient').select().where({patient_id: id})
			this.loaded = true
			Object.keys(resp).forEach(key => this[key] = resp[key])
			console.log(this)
		}
		logger.warn('Attempted to populate with invalid ID', meta)
		return false
	}

	async insert() {
		const isValid = !this.required.filter(key => !(this[key])).length
		if (!isValid) {
			logger.warn('unable to create', this.meta)
			return false
		}
		// create object
		this.last_updated = new Date()
		const obj = this.values
			.reduce((acc, cur) => {
				acc[cur] = this[cur]
				return acc
			}, {})
		// make query
		const [resp] = await knex('patient').insert(obj).returning(['patient_id', ...this.values])
		return resp
	}

	delete() {}

	update() {}
}

module.exports = Patient
