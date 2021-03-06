const {knex} = require('../../db')
const logger = require('../../logger')

class Contact {
	/**
	 * Contact wrapper for fhir data
	 * @param {object} params Params to create a contact
	 * @param {number} params.contact_id Contact ID in database
	 * @param {string} params.prefix prefix for our contact
	 * @param {string} params.fullname contact's full name
	 * @param {string} params.phone contact's phone number
	 * @param {string} params.family contact's family name (if applicable)
	 */
	constructor(params) {
		logger.silly(`attempting to make contact: ${JSON.stringify(params)}`, {file: 'fhir/Contact.js', func: 'constructor'})
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

	/**
	 * Populates the contact params based on the database response
	 * @return {Promise<void>} void
	 */
	async populate() {
		const {contact_id, meta} = this
		if (!contact_id) return logger.warn('no id, cannot retrieve', {...meta, func: 'populate()'})
		const [resp] = await knex('contact').select().where({contact_id})
		return Object.keys(resp).forEach(key => this[key] = resp[key])
	}

	/**
	 * adds the contact to the database as long as this[required] is on the object
	 * @return {Promise<object>} database response
	 */
	async insert() {
		const isValid = !this.required.filter(key => !(this[key])).length
		if (!isValid) return false
		// create object
		this.last_updated = new Date()
		const obj = this.values.reduce((acc, cur) => {
			acc[cur] = this[cur]
			return acc
		}, {})
		logger.silly(`attempting to create patient with ${JSON.stringify(obj)}`, {file: 'Contact.js', func: 'insert()'})
		// make query
		try {
			const [resp] = await knex('contact').insert(obj).returning(['contact_id', ...this.values])
			logger.debug('created contact', {file: 'Contact.js', func: 'insert()'})
			return resp
		} catch (err) {
			console.log('err')
			logger.error(err, {file: 'Contact.js', func: 'insert()'})
			return false
		}
	}
}

module.exports = Contact
