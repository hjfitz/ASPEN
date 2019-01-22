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
		'/Diagnostics/all': {

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
						schema: '#/definitions/OperationOutcome',
					},
				},
			},
			post: {
				tags: ['DiagnosticReport'],
				summary: 'View a diagnostic report by ID',
				responses: {
					200: {
						description: 'A persons vital signs has been updated',
						schema: '#/definitions/OperationOutcome',
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
				tags: ['DiagnosticReport'],
				summary: 'View a diagnostic report by ID',
				responses: {
					200: {
						description: 'A persons vital signs',
						schema: '#/definitions/DiagnosticReportLinked',
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
				tags: ['Observation'],
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
	definitions: {
		DiagnosticReportLinked: {
			properties: {
				resourceType: {type: 'string'},
				id: {type: 'integer'},
				meta: {$ref: '#/definitions/Meta'},
				subject: {type: 'string'},
				status: {type: 'string'},
				result: {
					type: 'array',
					items: {
						$ref: '#/definitions/Observation',
					},
				},
			},
		},
		DiagnosticReport: {
			properties: {
				resourceType: {type: 'string'},
				id: {type: 'integer'},
				meta: {$ref: '#/definitions/Meta'},
				subject: {type: 'string'},
				status: {type: 'string'},
				result: {
					type: 'array',
					items: 'string',
				},
			},
		},
		Meta: {
			properties: {
				lastUpdated: {type: 'string'},
			},
		},
		ObservationList: {
			type: 'array',
			$ref: '#/definitions/Observation',
		},
		Observation: {
			properties: {
				resourceType: {type: 'string'},
				id: {type: 'integer'},
				status: {type: 'string'},
				subject: {$ref: '#/definitions/Subject'},
				valueQuantity: {$ref: '#/definitions/ValueQuantity'},
			},
		},
		Subject: {
			properties: {
				reference: {type: 'string'},
			},
		},
		ValueQuantity: {
			properties: {
				value: {type: 'string'},
				system: {type: 'string'},
				unitCode: {type: 'string'},
			},
		},
		PatientResponse: {
			properties: {
				identifier: {
					type: 'array',
					$ref: '#/definitions/Identifier',
				},
				resourceType: {type: 'string'},
				active: {type: 'boolean'},
				name: {
					type: 'array',
					$ref: '#/definitions/Name',
				},
				gender: {
					type: 'string',
					enum: ['male', 'female', 'other'],
				},
				photo: {
					type: 'array',
					$ref: '#/definitions/Photo',
				},
				contact: {
					type: 'array',
					$ref: '#/ContactResponse',
				},
			},
		},
		Identifier: {
			properties: {
				use: {type: 'string'},
				system: {type: 'string'},
				value: {type: 'string'},
				assigner: {type: 'string'},
			},
		},
		Name: {
			properties: {
				use: {type: 'string'},
				text: {type: 'string'},
				family: {type: 'string'},
				given: {type: 'string'},
			},
		},
		Photo: {
			properties: {
				contentType: {type: 'string'},
				url: {type: 'string'},
				hash: {type: 'string'},
			},
		},
		ContactResponse: {
			properties: {
				name: {
					type: 'string',
					$ref: '#/definitions/ContactName',
				},
			},
		},
		ContactName: {
			properties: {
				use: {type: 'string'},
				text: {type: 'string'},
				family: {type: 'string'},
				given: {type: 'string'},
				prefix: {type: 'array'},
				telecom: {
					type: 'array',
					$ref: '#/definitions/ContactTelecom',
				},
			},
		},
		ContactTelecom: {
			properties: {
				system: {type: 'string'},
				value: {type: 'string'},
				use: {type: 'string'},
			},
		},
		OperationOutcome: {
			properties: {
				resourceType: {type: 'string'},
				issue: {
					type: 'array',
					$ref: '#/definitions/OperationIssue',
				},
				expression: {
					type: 'array',
					items: {
						type: 'string',
					},
				},
			},
		},
		OperationIssue: {
			properties: {
				severity: {type: 'string'},
				code: {type: 'integer'},
			},
		},
	},
}
