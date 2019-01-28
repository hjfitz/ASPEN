const express = require('express')
const swaggerUI = require('swagger-ui-express')
const apiDocs = require('./swagger')

const router = express.Router()
const fhir = require('./fhir')

router.use('/fhir', fhir)
router.use('/fhir-docs', swaggerUI.serve)
router.get('/fhir-docs', swaggerUI.setup(apiDocs, {explorer: true}))

module.exports = router
