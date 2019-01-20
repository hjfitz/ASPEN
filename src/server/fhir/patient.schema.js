module.exports = {
	identifier: [{
		use: 'usual',
		system: 'urn:ietf:rfc:3986',
		value: 'database id',
		assigner: 'SoN',
	}],
	resourceType: 'Patient',
	active: true / false,
	name: [{
		use: 'usual',
		text: 'Harry James Fitzgerald',
		family: 'Fitzgerald',
		given: 'Harry',
		prefix: ['Mr'],
	}],
	gender: 'male / female / other',
	birthDate: 'YYYY-MM-DD',
	photo: [{
		contentType: '(mimetype of image)',
		url: '(url of image)',
		hash: '(b64 hash of image)',
	}],
	contact: [{
		name: {
			use: 'usual',
			text: 'George Keith Brian Fitzgerald',
			family: 'Fitzgerald',
			given: 'George',
			prefix: ['Dr'],
			telecom: [{
				system: 'phone', // hardcode
				value: '07555000212', // custom
				use: 'home/work/other', // hardcode
			}],
		},
	}],
}
