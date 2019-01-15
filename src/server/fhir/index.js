const express = require('express')

const router = express.Router()
const patientRouter = require('./patient')

// https://www.hl7.org/fhir/http.html#mime-type
router.use((req, res, next) => {
	res.setHeader('content-type', 'application/fhir+json')
	next()
})

function createErr(req, res, code, diagnostics) {
	const err = {
		resourceType: 'OperationOutcome',
		issue: [{
			severity: 'error',
			code,
		}],
		expression: [req.originalUrl],
	}
	res.status(code).json(Object.assign({}, err, {diagnostics}))
}

// ensure the user knows which requests they can make
router.use((req, res, next) => {
	const {_format} = req.query
	const {accept} = req.headers
	const correctFormat = (_format && _format === 'application/fhir+json')
	const correctHeaders = (accept === 'application/fhir+json')
	if (correctFormat) {
		return createErr(req, res, 406, `Your _format, ${_format} is not accepted on this server`)
	}
	if (!correctHeaders) {
		return createErr(req, res, 406, `accept headers wrong. You sent ${accept}, but only "application/fhir+json is supported`)
	}
	return next()
})

router.use('/Patient', patientRouter)


// error handler - leave at base of fhir router
router.use((req, res, next, err) => {
	const {code, issue} = err
	createErr(req, res, code, issue)
})

module.exports = router
