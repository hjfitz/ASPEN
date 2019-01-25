const {knex} = require('../../db')
const logger = require('../../logger')

class Contact {
	constructor(params) {
		const {contact_id, prefix, fullname, given, phone, family} = params
		this.contact_id = contact_id
		this.prefix = prefix
		this.fullname = fullname
		this.given = given
		this.phone = phone
		this.family = family
		this.required = ['prefix', 'fullname', 'given', 'phone']
		this.values = [...this.required, 'family']
	}

	fhir() {}

	async populate() {
		const {contact_id, meta} = this
		if (!contact_id) return logger.warn('no id, cannot retrieve', {...meta, func: 'populate()'})
		const [resp] = await knex('contact').select().where({contact_id})
		return Object.keys(resp).forEach(key => this[key] = resp[key])
	}

	async insert() {
		const isValid = !this.required.filter(key => !(this[key])).length
		if (!isValid) return false
		// create object
		this.last_updated = new Date()
		const obj = this.values
			.reduce((acc, cur) => {
				acc[cur] = this[cur]
				return acc
			}, {})
		// make query
		const [resp] = await knex('contact').insert(obj).returning(['contact_id', ...this.values])
		return resp
	}

	delete() {}

	update() {}
}

module.exports = Contact
