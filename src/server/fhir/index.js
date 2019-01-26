const router = require('express').Router()
const fileUpload = require('express-fileupload')
const formData = require('express-form-data')
const bodyParser = require('body-parser')
const os = require('os')

const patientRouter = require('./patient')
const {connect} = require('../db')
const diagnosticRouter = require('./diagnostic-report')
const observationRouter = require('./observation')
const locationRouter = require('./location')
const encounterRouter = require('./encounter')
const {createOutcome} = require('./util')


// https://www.hl7.org/fhir/http.html#mime-type
router.use(async (req, res, next) => {
	res.setHeader('content-type', 'application/fhir+json')
	const {_format} = req.query
	const {accept, 'content-type': type} = req.headers
	const correctFormat = (_format && _format === 'application/fhir+json')
	const correctHeaders = (accept === 'application/fhir+json')
	const correctContent = (type !== 'application/x-www-form-urlencoded')
	if (correctFormat) {
		return createOutcome(req, res, 406, `Your _format, ${_format} is not accepted on this server`)
	}
	if (!correctHeaders) {
		return createOutcome(req, res, 406, `accept headers wrong. You sent ${accept}, but only "application/fhir+json is supported`)
	}
	if (!correctContent) {
		return createOutcome(req, res, 406, 'application/x-www-form-urlencoded is not accepted here', {}, 'error')
	}
	await connect()
	return next()
})

// ensure that forms can be read and files can be uploaded (patient ID)
router.use(fileUpload({limits: {fileSize: 50 * 1024 * 1024}}))
router.use(bodyParser.urlencoded({extended: false}))


router.use('/Observation', observationRouter)
router.use('/Diagnostics', diagnosticRouter)
router.use('/Encounter', encounterRouter)
router.use('/Location', locationRouter)
router.use('/Patient', patientRouter)

// error handler - leave at base of fhir router
router.use((req, res, next, err) => {
	const {code, issue} = err
	createOutcome(req, res, code, issue)
})

module.exports = router
