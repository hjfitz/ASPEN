const express = require('express')

const router = express.Router()
const fhir = require('./fhir')

router.use('/fhir', fhir)

module.exports = router
