const definitions = require('./definitions')

module.exports = {
	swagger: '2.0',
	info: {
		version: '1.0.0',
		title: 'FHIR Implementation for Node.js',
		description: 'A FYP @ UoP',
		license: {
			name: 'GPL-3.0',
			url: 'https://opensource.org/licenses/GPL-3.0',
		},
	},
	host: 'localhost:5000',
	basePath: '/fhir',
	tags: [
		{
			name: 'Patient',
			description: 'Patients and Contacts in the system',
		},
		{
			name: 'Vitals',
			description: 'Used to record vital signs',
		},
		{
			name: 'Encounter',
			description: 'Encounters with patients. Usually used for admissions to track rooms',
		},
		{
			name: 'Observation',
			description: 'Patient observation',
		},
		{
			name: 'DiagnosticReport',
			description: 'Vital sign observations',
		},
	],
	accepts: ['application/fhir+json'],
	produces: ['application/fhir+json'],
	paths: {
		'/Patient': {
			post: {
				tags: ['Patient'],
				description: 'Create a new patient in the FHIR server',
				parameters: [
					{
						name: 'patient-prefix',
						in: 'body',
						description: 'Prefix for our patient (Mr, Mrs, Dr)',
						required: true,
					},
					{
						name: 'patient-given',
						in: 'body',
						description: 'Patients given/first name',
						required: true,
					},
					{
						name: 'patient-fullname',
						in: 'body',
						description: 'Fullname for the patient',
						required: true,
					},
					{
						name: 'patient-gender',
						in: 'body',
						description: "Patient's gender",
						required: true,
					},
					{
						name: 'patient-family',
						in: 'body',
						description: "Patient's family name",
					},
					{
						name: 'profile',
						in: 'form',
						description: 'patient photograph',
					},
					{
						name: 'contact-prefix',
						in: 'body',
						description: 'Prefix for our contact (Mr, Mrs, Dr)',
						required: true,
					},
					{
						name: 'contact-given',
						in: 'body',
						description: "Contact's given/first name",
						required: true,
					},
					{
						name: 'contact-fullname',
						in: 'body',
						description: 'Fullname for the contact',
						required: true,
					},
					{
						name: 'contact-phone',
						in: 'body',
						description: "Contact's phone number",
						required: true,
					},
					{
						name: 'contact-family',
						in: 'body',
						description: "Contact's family name",
					},
				],
				produces: ['application/fhir+json'],
				responses: {
					200: {
						description: 'New patient is created',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
		},
		'/Patient/{patient_id}': {
			parameters: [{
				name: 'patient_id',
				in: 'path',
				required: true,
				description: 'ID of the patient thet we want to interact with ',
				type: 'string',
			}],
			get: {
				tags: ['Patient'],
				summary: 'Get a patient by their ID',
				responses: {
					200: {
						description: 'Patient (and contact) has been found',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
			delete: {
				tags: ['Patient'],
				summary: 'Delete patient with given ID',
				responses: {
					200: {
						description: 'Patient is deleted from the database',
						schema: {$ref: '#/definitions/OperationOutcome'},
					},
				},
			},
			put: {
				tags: ['Patient'],
				summary: 'Update a patient with their ID',
				parameters: [
					{
						name: 'patient-active',
						in: 'body',
						description: 'Prefix for our patient (Mr, Mrs, Dr)',
					},
					{
						name: 'patient-prefix',
						in: 'body',
						description: 'Prefix for our patient (Mr, Mrs, Dr)',
					},
					{
						name: 'patient-given',
						in: 'body',
						description: 'Patients given/first name',
					},
					{
						name: 'patient-fullname',
						in: 'body',
						description: 'Fullname for the patient',
					},
					{
						name: 'patient-gender',
						in: 'body',
						description: "Patient's gender",
					},
					{
						name: 'patient-family',
						in: 'body',
						description: "Patient's family name",
					},
					{
						name: 'patient-photo_url',
						in: 'body',
						description: 'Prefix for our patient (Mr, Mrs, Dr)',
					},
				],
				responses: {
					200: {
						description: 'User is updated',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
		},
		'/Diagnostics/': {
			post: {
				tags: ['DiagnosticReport'],
				summary: 'Create a diagnostic report',
				parameters: [
					{
						name: 'respiratory_rate',
						in: 'body',
						description: 'Patient respiratory rate (/min)',
					},
					{
						name: 'oxygen_saturation',
						in: 'body',
						description: 'Patient oxygen saturation (%)',
					},
					{
						name: 'supplemental_oxygen',
						in: 'body',
						description: 'Whether the patient has supplemental oxygen (true/false)',
					},
					{
						name: 'body_temperature',
						in: 'body',
						description: 'Patient body temperature (C)',
					},
					{
						name: 'systolic_bp',
						in: 'body',
						description: 'patient blood pressure (mmHg)',
					},
					{
						name: 'heart_rate',
						in: 'body',
						description: 'patient heart rate (/min)',
					},
					{
						name: 'level_of_consciousness',
						in: 'body',
						description: 'AVPU level of consciousness',
					},
					{
						name: 'patient_id',
						in: 'body',
						description: 'Patient ID (database)',
					},
				],
				responses: {
					200: {
						description: 'A persons vital recordings have been updated',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
		},
		'/Diagnostics/{diagnostic_id}': {
			parameters: [{
				name: 'diagnostic_id',
				in: 'path',
				required: true,
				description: 'ID diagnostics to view ',
				type: 'string',
			}],
			get: {
				tags: ['DiagnosticReport'],
				summary: 'View a diagnostic report by ID',
				responses: {
					200: {
						description: 'A persons vital signs',
						schema: '#/definitions/DiagnosticReport',
					},
				},
			},
			delete: {
				tags: ['DiagnosticReport'],
				summary: 'View a diagnostic report by ID',
				responses: {
					200: {
						description: 'A persons vital signs has been deleted',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
		},
		'/Diagnostics/{diagnostic_id}/linked': {
			parameters: [{
				name: 'diagnostic_id',
				in: 'path',
				required: true,
				description: 'ID diagnostics to view ',
				type: 'string',
			}],
			get: {
				tags: ['DiagnosticReport', 'Vitals'],
				summary: 'View a diagnostic report by ID',
				responses: {
					200: {
						description: 'A persons vital signs',
						schema: '#/definitions/DiagnosticReportLinked',
					},
				},
			},
		},
		'/Encounter': {
			post: {
				tags: ['Encounter'],
				summary: 'Create an encounter',
				parameters: [
					{
						name: 'class',
						in: 'body',
						required: true,
						description: 'The type of encounter (generally "admission")',
					},
					{
						name: 'status',
						in: 'body',
						required: true,
						description: 'The status of the visit (generally "finished")',
					},
					{
						name: 'patient_id',
						in: 'body',
						required: true,
						description: 'The patient to which this encounter pertains',
					},
					{
						name: 'location_id',
						in: 'body',
						required: true,
						description: 'Where the encounter took place',
					},
				],
				responses: {
					200: {
						description: 'An encounter has been created',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
		},
		'/Encounter/{encounter_id}': {
			parameters: [{
				name: 'encounter_id',
				in: 'path',
				required: true,
				description: 'ID of a given encounter',
				type: 'integer',
			}],
			get: {
				tags: ['Encounter'],
				summary: 'Get an encounter by ID',
				responses: {
					200: {
						description: 'An enounter has been fetched',
						schema: {
							$ref: '#/definitions/EncounterResponse',
						},
					},
				},
			},
			put: {
				tags: ['Encounter'],
				summary: 'Update an encounter by ID',
				parameters: [
					{
						name: 'class',
						in: 'body',
						description: 'The type of encounter (generally "admission")',
					},
					{
						name: 'status',
						in: 'body',
						description: 'The status of the visit (generally "finished")',
					},
					{
						name: 'patient_id',
						in: 'body',
						description: 'The patient to which this encounter pertains',
					},
					{
						name: 'location_id',
						in: 'body',
						description: 'Where the encounter took place',
					},
				],
				responses: {
					200: {
						description: 'A persons vital signs has been deleted',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
			delete: {
				tags: ['Encounter'],
				summary: 'Delete an encounter by ID',
				responses: {
					200: {
						description: 'A persons vital signs has been deleted',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
		},
		'/Location': {
			post: {
				description: 'create a new location',
				patameters: [
					{
						name: 'name',
						in: 'body',
						required: true,
						description: 'Name of the new location',
					},
					{
						name: 'description',
						in: 'body',
						required: true,
						description: 'Description of the new location',
					},
					{
						name: 'type',
						in: 'body',
						required: true,
						description: 'The type of new location (wing/ward)',
					},
				],
				responses: {
					200: {
						description: 'A location was successfully added',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
		},
		'/Location/{location_id}': {
			parameters: [{
				name: 'location_id',
				in: 'path',
				required: true,
				description: 'ID of a given location',
				type: 'integer',
			}],
			get: {
				tags: ['Location'],
				summary: 'get a location',
				responses: {
					200: {
						description: 'A location in the area',
						schema: {
							$ref: '#/defintions/LocationResponse',
						},
					},
				},
			},
			delete: {
				tags: ['Location'],
				summary: 'Delete a location',
				responses: {
					200: {
						description: 'A location was successfully deleted',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
		},

		'/Observation/{observation_id}': {
			parameters: [{
				name: 'observation_id',
				in: 'path',
				required: true,
				description: 'ID of a given observation',
				type: 'integer',
			}],
			get: {
				tags: ['Observation', 'Vitals'],
				summary: 'Get an observation by ID',
				responses: {
					200: {
						description: 'Observation has been found',
						schema: {$ref: '#/definitions/Observation'},
					},
				},
			},
		},
	},
	definitions,
}
