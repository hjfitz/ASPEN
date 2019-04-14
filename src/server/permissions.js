const permissionsRouter = require('express').Router()
const {knex} = require('./db')
const {decodeJWTPayload} = require('./auth/token')
// query for practitioner

permissionsRouter.post('/create', async (req, res) => {
	const {permissions} = decodeJWTPayload(req.headers.token)
	if (!permissions.includes('edit:link')) {
		res.sendStatus(401)
		return
	}
	const resp = await knex('practitionerpatients').insert({
		practitioner_id: req.body.practitionerID,
		patient_id: req.body.patientID,
	})
	res.json(resp)
})

permissionsRouter.post('/destroy', async (req, res) => {
	const {permissions} = decodeJWTPayload(req.headers.token)
	if (!permissions.includes('edit:link')) {
		res.sendStatus(401)
		return
	}
	const unionDeleted = await knex('practitionerpatients').delete().where({
		practitioner_id: req.body.practitionerID,
		patient_id: req.body.patientID,
	})
	res.json(unionDeleted)
})

permissionsRouter.post('/toggle', async (req, res) => {
	const decodedToken = decodeJWTPayload(req.headers.token)
	console.log(decodedToken)
	if (decodedToken.permissions.includes('edit:permissions')) {
		// if the permission is in the permission set, remove it
		console.log(req.body)
		const index = req.body.set.indexOf(req.body.permission)

		if (index > -1) req.body.set.splice(index, 1)
		else req.body.set.push(req.body.permission)

		const [row] = await knex('practitioner')
			.where({practitioner_id: req.body.practitionerID})
			.update({
				permissions: JSON.stringify(req.body.set),
			}).returning('*')
		delete row.passhash
		res.send(row)
	} else {
		res.sendStatus(401)
	}
})


permissionsRouter.get('/view/:id', async (req, res) => {
	const [practitioner] = await knex('practitioner').select().where({
		practitioner_id: req.params.id,
	})
	delete practitioner.passhash
	res.json(practitioner)
})

permissionsRouter.get('/relationships/:id', async (req, res) => {
	const unionTable = await knex('practitionerpatients').select().where({practitioner_id: req.params.id})
	res.json(unionTable)
})

module.exports = permissionsRouter
