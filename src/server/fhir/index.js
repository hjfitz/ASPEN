const express = require('express')
const fileUpload = require('express-fileupload')

const router = express.Router()
const patientRouter = require('./patient')
const {connect} = require('../db')
const {diagnostic, observation} = require('./diagnostic-report')
const {createOutcome} = require('./util')

// https://www.hl7.org/fhir/http.html#mime-type
router.use((req, res, next) => {
	res.setHeader('content-type', 'application/fhir+json')
	next()
})

router.use((req, res, next) => connect().then(next))

// ensure the user knows which requests they can make
router.use((req, res, next) => {
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
	return next()
})

router.use(fileUpload({limits: {fileSize: 50 * 1024 * 1024}}))


router.use('/Diagnostics', diagnostic)
router.use('/Observation', observation)
router.use('/Patient', patientRouter)

// error handler - leave at base of fhir router
// todo: fix me
router.use((err, req, res) => {
	const {code, issue} = err
	createOutcome(req, res, code, issue)
})

module.exports = router
