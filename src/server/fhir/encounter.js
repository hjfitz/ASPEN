const express = require('express')

const encounterRouter = express.Router()

encounterRouter.post('/', async (req, res) => {
	const {status, classification, patient, location} = req.body
})


module.exports = encounterRouter
