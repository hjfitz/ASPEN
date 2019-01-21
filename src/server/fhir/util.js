function createOutcome(req, res, code, text, diagnostics = {}, severity = 'error') {
	const err = {
		resourceType: 'OperationOutcome',
		issue: [{
			severity,
			code,
		}],
		expression: [req.originalUrl],
	}
	res.status = code
	res.json(Object.assign({}, err, {details: {text}, diagnostics}))
}

module.exports = {
	createOutcome,
}
