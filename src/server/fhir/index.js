const express = require('express')
const fileUpload = require('express-fileupload')

const router = express.Router()
const patientRouter = require('./patient')
const {connect} = require('../db')
const diagnosticRouter = require('./diagnostic-report')
const observationRouter = require('./observation')
const {createOutcome} = require('./util')

// https://www.hl7.org/fhir/http.html#mime-type
router.use(async (req, res, next) => {
	res.setHeader('content-type', 'application/fhir+json')
	const {_format} = req.query
	const {accept} = req.headers
	const correctFormat = (_format && _format === 'application/fhir+json')
	const correctHeaders = (accept === 'application/fhir+json')
	if (correctFormat) {
		return createOutcome(req, res, 406, `Your _format, ${_format} is not accepted on this server`)
	}
	if (!correctHeaders) {
		return createOutcome(req, res, 406, `accept headers wrong. You sent ${accept}, but only "application/fhir+json is supported`)
	}
	await connect()
	return next()
})

router.use(fileUpload({limits: {fileSize: 50 * 1024 * 1024}}))


router.use('/Diagnostics', diagnosticRouter)
router.use('/Observation', observationRouter)
router.use('/Patient', patientRouter)

// error handler - leave at base of fhir router
// todo: fix me
router.use((req, res, next, err) => {
	const {code, issue} = err
	createOutcome(req, res, code, issue)
})

module.exports = router
