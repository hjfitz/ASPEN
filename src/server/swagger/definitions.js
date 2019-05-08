module.exports = {
	Name: {
		properties: {
			use: {type: 'string'},
			text: {type: 'string'},
			family: {type: 'string'},
			given: {type: 'string'},
		},
	},
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
	HistoryHealth: {
		properties: {
			'childhood-illnesses': {
				type: 'array',
				items: {
					type: 'string',
				},
			},
			immunisations: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
			'medical-issues': {
				type: 'array',
				items: {
					type: 'string',
				},
			},
			operations: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
			hospitalisations: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
		},
	},
	HistoryRequest: {
		properties: {
			health: {$ref: '#/definitions/HistoryHealth'},
			// medications: {$ref: '#/definitions/HistoryMedications'}
			medication: {
				properties: {
					prescription: {
						type: 'array',
						items: {
							type: 'objects',
							properties: {
								name: {type: 'string'},
								dose: {type: 'string'},
								freq: {type: 'string'},
							},
						},
					},
				},
			},
			otc: {
				properties: {
					prescription: {
						type: 'array',
						items: {
							type: 'objects',
							properties: {
								name: {type: 'string'},
								dose: {type: 'string'},
								freq: {type: 'string'},
							},
						},
					},
				},
			},
			exercise: {
				properties: {
					frequency: {type: 'string'},
				},
			},
			diet: {
				properties: {
					dieting: {type: 'boolean'},
					'difficulties-eating': {type: 'boolean'},
					'meals-eaten': {type: 'integer'},
				},
			},
			alcohol: {
				properties: {
					'does-drink': {type: 'boolean'},
					type: {type: 'string'},
					alcoholFreq: {type: 'string'},
					concern: {type: 'boolean'},
					'consider-stopping': {type: 'boolean'},
				},
			},
			tobacco: {
				properties: {
					'used-prior': {type: 'boolean'},
					'last-use': {type: 'string'},
					'type-used': {type: 'string'},
					'current-use': {type: 'boolean'},
					'nicotine-replace-therapy': {type: 'boolean'},
					'nicotine-replacement-types': {type: 'string'},
				},
			},
			drug: {
				properties: {
					'currently-use': {type: 'boolean'},
					injected: {type: 'boolean'},
					'drug-use-frequency': {
						properties: {
							prescription: {
								type: 'array',
								items: {
									type: 'objects',
									properties: {
										name: {type: 'string'},
										dose: {type: 'string'},
										freq: {type: 'string'},
									},
								},
							},
						},
					},
				},
			},
			other: {
				properties: {
					'mental-health-wellbeing': {type: 'string'},
					'social-history': {type: 'string'},
					'family-history': {type: 'string'},
					'relevant-history': {type: 'string'},
				},
			},
			patient_id: {type: 'integer'},
			sign: {
				properties: {
					practitioner_id: {type: 'integer'},
					date: {type: 'string'},
					designation: {type: 'string'},
					image: {type: 'string'},
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
	PatientBundle: {
		properties: {
			resourceType: {type: 'string'},
			meta: {$ref: '#/definitions/Meta'},
			type: {type: 'string'},
			entry: {
				type: 'array',
				$ref: '#/definitions/PatientResponse',
			},
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
				$ref: '#/definitions/ContactResponse',
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
			prefix: {
				type: 'array',
				items: {type: 'string'},
			},
			telecom: {
				type: 'array',
				items: {
					$ref: '#/definitions/ContactTelecom',
				},
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
	Practitioner: {
		properties: {
			resourceType: {type: 'string'},
			active: {type: 'string'},
			id: {type: 'integer'},
			lastUpdated: {type: 'string'},
			name: {
				type: 'array',
				$ref: '#/definitions/Name',
			},
			telecom: {
				type: 'array',
				items: {
					$ref: '#/definitions/ContactTelecom',
				},
			},
		},
	},
	PractitionerBundle: {
		properties: {
			resourceType: {type: 'string'},
			meta: {$ref: '#/definitions/Meta'},
			type: {type: 'string'},
			entry: {
				type: 'array',
				$ref: '#/definitions/Practitioner',
			},
		},
	},
}
