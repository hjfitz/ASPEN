module.exports = {
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
	LocationResponse: {
		properties: {
			resourceType: {type: 'string'},
			id: {type: 'integer'},
			meta: {$ref: '#/definitions/Meta'},
			status: {type: 'string'},
			name: {type: 'string'},
			description: {type: 'string'},
			coding: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
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
			subject: {$ref: '#/definitions/Reference'},
			valueQuantity: {$ref: '#/definitions/ValueQuantity'},
		},
	},
	Reference: {
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
	Class: {
		properties: {
			data: {type: 'string'},
		},
	},
	EncounterResponse: {
		properties: {
			resourceType: {type: 'string'},
			meta: {$ref: '#/definitions/Meta'},
			status: {type: 'string'},
			class: {
				$ref: '#/definitions/Class',
			},
			subject: {$ref: '#/definitions/Reference'},
			location: {
				type: 'array',
				items: {
					$ref: '#/definitions/Meta',
				},
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
}
