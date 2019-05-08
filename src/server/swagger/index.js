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
			get: {
				tags: ['Patient'],
				consumes: 'application/json',
				description: 'Create a new patient in the FHIR server',
				produces: ['application/fhir+json'],
				responses: {
					200: {
						description: 'All patients are found',
						schema: {
							$ref: '#/definitions/PatientBundle',
						},
					},
				},
			},
			post: {
				tags: ['Patient'],
				consumes: 'application/json',
				description: 'Create a new patient in the FHIR server',
				parameters: [{
					in: 'body',
					name: 'body',
					schema: {
						$ref: '#/definitions/PatientResponse',
					},
				}],
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
			get: {
				tags: ['DiagnosticReport'],
				summary: 'Query for reports',
				parameters: [
					{
						in: 'path',
						name: 'patient',
						description: 'Patient ID to get reports for',
					},
					{
						in: 'path',
						name: 'result',
						description: 'whether to link results (true/false)',
					},
					{
						in: 'path',
						name: '_count',
						description: 'amount of results to return',
					},
					{
						in: 'path',
						name: 'page',
						description: 'page of results to return',
					},
				],
			},
			post: {
				tags: ['DiagnosticReport'],
				summary: 'Create a diagnostic report',
				parameters: [{
					in: 'body',
					name: 'body',
					schema: {
						$ref: '#/definitions/DiagnosticReportLinked',
					},
				}],
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
						schema: {
							$ref: '#/definitions/DiagnosticReportLinked',
						},
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
		'/Encounter': {
			post: {
				tags: ['Encounter'],
				summary: 'Create an encounter',
				parameters: [{
					in: 'body',
					name: 'body',
					schema: {
						$ref: '#/definitions/EncounterResponse',
					},
				}],
				// parameters: [
				// 	{
				// 		name: 'class',
				// 		in: 'body',
				// 		required: true,
				// 		description: 'The type of encounter (generally "admission")',
				// 	},
				// 	{
				// 		name: 'status',
				// 		in: 'body',
				// 		required: true,
				// 		description: 'The status of the visit (generally "finished")',
				// 	},
				// 	{
				// 		name: 'patient_id',
				// 		in: 'body',
				// 		required: true,
				// 		description: 'The patient to which this encounter pertains',
				// 	},
				// 	{
				// 		name: 'location_id',
				// 		in: 'body',
				// 		required: true,
				// 		description: 'Where the encounter took place',
				// 	},
				// ],
				responses: {
					200: {
						description: 'An encounter has been created',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
			get: {
				tags: ['Encounter'],
				summary: 'Get an encounter',
				parameters: [
					// class, include
					{
						in: 'path',
						name: 'class',
						description: 'Type of encounter (generally admission)',
					},
					{
						in: 'path',
						name: '_include',
						description: 'information to include, separated by semicolon. generally patient;location',
					},
				],
				responses: {
					200: {
						description: 'An enounter has been fetched',
						type: 'array',
						items: {
							$ref: '#/definitions/EncounterResponse',
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
				parameters: [{
					in: 'body',
					name: 'body',
					schema: {
						$ref: '#/definitions/EncounterResponse',
					},
				}],
				// parameters: [
				// 	{
				// 		name: 'class',
				// 		in: 'body',
				// 		description: 'The type of encounter (generally "admission")',
				// 	},
				// 	{
				// 		name: 'status',
				// 		in: 'body',
				// 		description: 'The status of the visit (generally "finished")',
				// 	},
				// 	{
				// 		name: 'patient_id',
				// 		in: 'body',
				// 		description: 'The patient to which this encounter pertains',
				// 	},
				// 	{
				// 		name: 'location_id',
				// 		in: 'body',
				// 		description: 'Where the encounter took place',
				// 	},
				// ],
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
				tags: ['Location'],
				description: 'create a new location',
				parameters: [{
					in: 'body',
					name: 'body',
					schema: {
						$ref: '#/definitions/LocationResponse',
					},
				}],
				responses: {
					200: {
						description: 'A location was successfully added',
						schema: {
							$ref: '#/definitions/OperationOutcome',
						},
					},
				},
			},
			get: {
				tags: ['Location'],
				description: 'find a location',
				responses: {
					200: {
						description: 'A location was successfully added',
						// schema: {
						type: 'array',
						items: {

							$ref: '#/definitions/LocationResponse',
						},
						// },
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
		'/Practitioner': {
			get: {
				tags: ['Practitioner'],
				summary: 'Get all practitioner',
				responses: {
					200: {
						description: 'Practitioner has been found',
						schema: {$ref: '#/definitions/PractitionerBundle'},
					},
				},
			},
		},
		'/Practitioner/{id}': {
			parameters: [{
				name: 'id',
				in: 'path',
				required: true,
				description: 'ID of a given practitioner',
				type: 'integer',
			}],
			get: {
				tags: ['Practitioner'],
				summary: 'Get an practitioner by ID',
				responses: {
					200: {
						description: 'Practitioner has been found',
						schema: {$ref: '#/definitions/Practitioner'},
					},
				},
			},
		},
		'/History': {
			post: {
				tags: ['History'],
				summary: 'Add a patient history',
				parameters: [{
					in: 'body',
					name: 'body',
					schema: {
						$ref: '#/definitions/HistoryRequest',
					},
				}],
				responses: {
					200: {
						description: 'History has been saved',
						schema: {$ref: '#/definitions/OperationOutcome'},
					},
				},
			},
		},
		'/History/{id}': {
			parameters: [{
				name: 'id',
				in: 'path',
				required: true,
				description: 'ID of a given history',
				type: 'integer',
			}],
			get: {
				tags: ['History'],
				summary: 'Get a history by ID',
				responses: {
					200: {
						description: 'History has been found',
						schema: {$ref: '#/definitions/HistoryRequest'},
					},
				},
			},
		},
	},
	definitions,
}
