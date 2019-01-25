const Contact = require('./Contact')
const logger = require('../../logger')
const {client} = require('../../db')

class Patient {
	constructor(params) {
		this.loaded = false
		this.id = params.id
		this.active = params.active
		this.fullname = params.fullname
		this.given = params.given
		this.prefix = params.prefix
		this.gender = params.gender
		this.last_updated = params.last_updated
		this.photo_url = params.photo_url
		this.family = params.family
		this.contact_id = params.contact_id
		this.contact = new Contact(params.contact)
		this.required = [
			'active',
			'fullname',
			'given',
			'prefix',
			'gender',
			'last_updated',
			'contact_id',
		]
		this.values = [...this.required, 'photo_url', 'family']
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

	get valid() {

	}

	get query() {
		return {
			insert: () => {
				const valid = this.required.filter(Boolean).length
				if (!valid) return false
				const keys = this.values.filter(Boolean)
				const values = keys.map(key => this[key])
				const cols = keys.join(', ')
				const dolla = keys.map((_, idx) => idx).join(', ')
				return {
					values,
					name: 'add-patient',
					text: `INSERT INTO PATIENT (${cols}) VALUES ${dolla} RETURNING patient_id;`,
				}
			},
			delete: () => {

			},
			update: {

			},
		}
	}

	toFhir() {

	}
}

module.exports = Patient
