// https://www.hl7.org/fhir/patient.html
const express = require('express')
const multer = require('multer')
const pg = require('pg')

const upload = multer({storage: 'patient/'})
const patientRouter = express.Router()
const isConnected = false

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

// read
patientRouter.get('/:id', (req, res) => {

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
