const express = require('express')
const swaggerUI = require('swagger-ui-express')
const auth = require('./auth')
const apiDocs = require('./swagger')

const router = express.Router()
const fhir = require('./fhir')

router.use('/docs/api', swaggerUI.serve)
router.get('/docs/api', swaggerUI.setup(apiDocs, {explorer: true}))
router.use(auth)
router.use('/fhir', fhir)

module.exports = router
