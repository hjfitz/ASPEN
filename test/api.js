const {expect} = require('chai')

describe('FHIR API', () => {
	describe('Generic operations', () => {
		it('should reject requests that do not have accept:application/fhir+json in their header', () => {

		})

		it('should reject unauthorised requests', () => {

		})
	})
	describe('/History', () => {
		describe('POST /', () => {
			it('should create a history with all required fields', () => {

			})
		})

		describe('GET /$ID', () => {
			it('should get a patient history', () => {

			})
		})
	})

	describe('/Location', () => {
		describe('GET /?type=Ward', () => {
			it('should list all locations of type WARD in FHIR format', () => {

			})
		})

		describe('POST /', () => {
			it('should create a new ward with just a description and name', () => {

			})

			it('should return an OperationOutcome with an malformed request (no ward name)', () => {

			})
		})
	})

	describe('/Patient', () => {
		describe('POST /', () => {
			it('should create a patient', () => {

			})

			it('should not allow creation of a when FHIR required data is missing', () => {

			})

			it('should not create a patient when the contact is missing', () => {

			})
		})

		describe('GET /?_query', () => {
			it('should enable querying for a patient', () => {

			})
		})

		describe('DELETE /$ID', () => {
			it('should delete an entry based on patient ID', () => {

			})
		})
	})

	describe('/Practitioner', () => {
		describe('GET /', () => {
			it('should return a Bundle resource with all practitioners', () => {

			})
		})

		describe('GET /1', () => {
			it('should return one FHIR Practitioner', () => {

			})
		})
	})

	describe('/Encounter', () => {
		describe('POST /', () => {
			it('should create an encounter given valid IDs', () => {

			})

			it('should error on no data', () => {

			})

			it('should not create an encounter if the user does not have the correct permissions', () => {

			})
		})

		describe('GET /?class=admission&_include=Encounter:patient;location', () => {
			it('should return all admissions with ward information and patient information', () => {

			})

			it('should not let a user see all patients if the correct permission does not exist', () => {

			})
		})

		describe('GET /?class=admission&_include=Encounter:patient', () => {
			it('should return all encounters with basic location information Location/$NUM and patients', () => {

			})
		})

		describe(' GET /?class=admission&patient_id=$ID&_include=Encounter:patient', () => {
			it('should return all patient information for a given patient', () => {

			})
		})

		describe('GET /?class=admission&location_id=$ID&_include=Encounter:patient', () => {
			it('should return all patient admissions for the given location', () => {

			})
		})
	})

	describe('/Diagnostics', () => {
		describe('POST /', () => {
			it('should create entries for each observation and the entire report', () => {

			})
		})

		describe('GET /?patient=$ID', () => {
			it('should get all history for a patient with a given ID', () => {

			})
		})

		describe('get /?patient=$ID&count=$NUM', () => {
			it('should return 10 results', () => {

			})

			it('should return 5 results', () => {

			})
		})

		describe('GET /?patient=$ID&count=$NUM&pageNo=$NUM', () => {
			it('should return the first page of results', () => {

			})

			it('should return the second page of results', () => {

			})
		})
	})
})
