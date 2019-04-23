const router = require('express').Router()
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')

const logger = require('../logger')
const patientRouter = require('./patient')
const diagnosticRouter = require('./diagnostic-report')
const observationRouter = require('./observation')
const locationRouter = require('./location')
const encounterRouter = require('./encounter')
const historyRouter = require('./history')
const practitionerRouter = require('./practitioner')
const {createOutcome} = require('./util')

const meta = {file: 'fhir/index.js'}

// https://www.hl7.org/fhir/http.html#mime-type
router.use(async (req, res, next) => {
	res.setHeader('content-type', 'application/fhir+json')
	const {_format} = req.query
	const {accept, 'content-type': type} = req.headers
	const correctFormat = (_format && _format === 'application/fhir+json')
	const correctHeaders = accept.split(' ').includes('application/fhir+json')
	const correctContent = (type !== 'application/x-www-form-urlencoded')
	if (correctFormat) {
		logger.warn(`_format incorrect! ${_format}`, {...meta, func: 'validation mw'})
		return createOutcome(req, res, 406, `Your _format, ${_format} is not accepted on this server`)
	}
	if (!correctHeaders) {
		logger.warn(`headers incorrect: ${accept}`, {...meta, func: 'validation mw'})
		return createOutcome(req, res, 406, `accept headers wrong. You sent ${accept}, but only "application/fhir+json is supported`)
	}
	if (!correctContent) {
		logger.warn('bad content-type (application/x-www-form-urlencoded', {...meta, func: 'validation mw'})
		return createOutcome(req, res, 406, 'application/x-www-form-urlencoded is not accepted here', {}, 'error')
	}
	logger.silly('good request', {...meta, func: 'validation mw'})
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
router.use('/History', historyRouter)
router.use('/Practitioner', practitionerRouter)

// error handler - leave at base of fhir router
router.use((req, res, next, err) => {
	const {code, issue} = err
	createOutcome(req, res, code, issue)
})

module.exports = router
