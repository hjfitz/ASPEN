// https://www.hl7.org/fhir/patient.html
const express = require('express')
const multer = require('multer')
const pg = require('pg')
const logger = require('../../../logger')

const upload = multer({storage: 'patient/'})
const patientRouter = express.Router()
let isConnected = false

const client = new pg.Client(process.env.DATABASE_URL)
const log = (level, message, func) => logger.log(level, message, {file: 'logger.js', func})

async function connect() {
	if (isConnected) return
	await client.connect()
	log('debug', 'successfully connected to database', 'connect()')
	isConnected = true
}

connect()


log('info', `attempting to connect to postgres on ${process.env.DATABASE_URL}`, 'main')

/**
patient schema:
{
	identifier: [{
		use: "usual",
		system: "urn:ietf:rfc:3986",
		value: "database id",
		assigner: "SoN"
	}]
	resourceType: "Patient",
	active: true/false,
	name: [{
		use: "usual",
		text: "Harry James Fitzgerald",
		family: "Fitzgerald",
		given: "Harry",
		prefix: ["Mr"]
	}],
	gender: male/female/other,
	birthDate: "YYYY-MM-DD",
	photo: [{
		contentType: (mimetype of image),
		url: (url of image),
		hash: (b64 hash of image),
	}],
	contact: [{
		name: {
			use: "usual",
			text: "George Keith Brian Fitzgerald",
			family: "Fitzgerald",
			given: "George",
			prefix: ["Dr"]
			telecom: [{
				system: phone, // hardcode
				value: 07555000212, // custom
				use: home/work/other //hardcode
			}]
		}
	}]
}
*/

// ensure that database connection is active
patientRouter.use(async (req, res, next) => {
	await connect()
	next()
})

// debug
patientRouter.get('/all', async (req, res) => {
	log('info', 'attempting to retrieve all patient data', 'GET /all')
	const resp = await client.query('SELECT * FROM patient')
	res.json(resp.rows)
})

// read
patientRouter.get('/:id', async (req, res, next) => {
	const {id} = req.params
	const query = {
		text: 'SELECT * FROM patient WHERE patient_id = $1',
		values: [id],
	}
	log('debug', `retrieving patient with id ${id}`, 'GET /:id')
	const {rows: [resp]} = await client.query(query)
	if (!resp) next({code: 404, issue: `Patient with "${id}" not found`})
	res.json(resp)
})

// create
patientRouter.post('/', upload.single('profile'), (req, res, next) => {
	const {file, body} = req
	const {gender, name, contact} = body
	const {full, family, given, prefix} = name
	// validate user input
	// validateNewPatient(file, name,)
})

// update
patientRouter.put('/:id', (req, res) => {

})

// delete
patientRouter.delete('/:id', (req, res) => {

})

module.exports = patientRouter
