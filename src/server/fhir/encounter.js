const encounterRouter = require('express').Router()

encounterRouter.post('/', async (req, res) => {
	const {status, classification, patient, location} = req.body
})


module.exports = encounterRouter
