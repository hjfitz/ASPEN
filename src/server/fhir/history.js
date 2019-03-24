const historyRouter = require('express').Router()
const OperationOutcome = require('./classes/OperationOutcome')
const {knex} = require('../db')


historyRouter.get('/:id', async (req, res) => {
	const [row] = await knex('patient_history').select().where({patient_id: req.params.id})
	if (row) {
		const [practitioner] = await knex('practitioner').select().where({practitioner_id: row.sign_off_userid})
		res.json({...row, ...practitioner})
	} else {
		const outcome = new OperationOutcome('error', 404, req.originalUrl, 'unable to find history')
		outcome.makeResponse(res)
	}
})

historyRouter.post('/', async (req, res) => {
	try {
		const queries = []
		console.log(req.body)
		const historyBody = {
			// health history
			childhood_illnesses: req.body.health['childhood-illnesses'],
			immunisations: req.body.health.immunisations,
			medical_issues: req.body.health['medical-issues'],
			surgical_operations: req.body.health.operations,
			other_hospitalisations: req.body.health.hispitalisations,
			// medications. otc and prescription meds are in mtm so omitted from this body
			allergies: req.body.medication.allergies,
			// exercise information
			exercise_frequency: req.body.exercise.frequency,
			// dietary information
			dieting: req.body.diet.dieting,
			difficulties_eating: req.body.diet['difficulties-eating'],
			meals_daily: parseInt(req.body.diet['meals-eaten'], 10),
			// alcoholism questions
			drinks_alcohol: req.body.alcohol['does-drink'] || null,
			alcohol_type: req.body.alcohol.type || null,
			alcoholic_drinks_weekly: req.body.alcoholfreq || null,
			alcohol_concern: req.body.alcohol.concern || null,
			alcohol_consider_stopping: req.body.alcohol['consider-stopping'] || null,
			// tobacco questions
			tobacco_used_past_5_years: req.body.tobacco['used-prior'],
			tobacco_last_smoked: req.body.tobacco['last-use'],
			tobacco_type: req.body.tobacco['type-used'],
			currently_uses_tobacco: req.body.tobacco['current-use'],
			currently_uses_tobacco_repalcement: req.body.tobacco['nicotine-replace-therapy'],
			tobacco_replacement_type: req.body.tobacco['nicotine-replacement-types'],
			// drugs question - type and freq mtm
			uses_recreational_drugs: req.body.drug['currently-use'],
			used_recreational_with_needle: req.body.drug.injected,
			// other questions
			mental_health_history: req.body.other['mental-health-wellbeing'],
			social_history: req.body.other['social-history'],
			family_history: req.body.other['family-history'],
			relevant_history: req.body.other['relevant-history'],
			// sign off
			practitioner_id: req.body.sign.practitioner_id,
			date: new Date(req.body.sign.date),
			designation: req.body.sign.designation,
			signature_blob: req.body.sign.image,
		}
		queries.push(knex('patient_history').insert(historyBody).returning('history_id'))
		if (req.body.mediaction.prescription) {
			const scripBody = {
				medication_name: req.body.medication.prescription.name,
				medication_dose: req.body.medication.prescription.dose,
				medication_frequency: req.body.medication.prescription.frequency,
			}
			queries.push(knex('medication_usage').insert(scripBody).returning('medication_usage_id'))
		}
		if (req.body.medication.otc) {
			const scripBody = {
				medication_name: req.body.medication.otc.name,
				medication_dose: req.body.medication.otc.dose,
				medication_frequency: req.body.medication.otc.frequency,
			}
			queries.push(knex('medication_usage').insert(scripBody).returning('medication_usage_id'))
		}
		if (req.body.drug.used) {
			const scripBody = {
				medication_name: req.body.drug.used.name,
				medication_dose: req.body.drug.used.dose,
				medication_frequency: req.body.drug.used.frequency,
			}
			queries.push(knex('medication_usage').insert(scripBody).returning('medication_usage_id'))
		}
		// async do all promises
		await Promise.all(queries) // this will not work as not all mtm will be populated. see 3 if statements! tired reeeeeeee
		// create mtm relations

		// const results = Object.keys(queries).reduce((acc, cur) => {})
		// const resp = await knex('patient_history').insert(req.body)
		const outcome = new OperationOutcome('success', 200, req.url, 'Successfully added history', resp)
		return outcome.makeResponse(res)
	} catch (err) {
		const outcome = new OperationOutcome('error', 500, req.url, err)
		return outcome.makeResponse(res)
	}
})

module.exports = historyRouter
