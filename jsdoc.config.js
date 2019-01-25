module.exports = {
	recurseDepth: 15,
	source: {
		include: [
			'./server.js',
			'./bin/www.js',
			'src/',
			'./README.md',
		],
		includePattern: /\.jsx?$/,
		excludePattern: '(node_modules|docs)',
	},
	opts: {
		template: 'node_modules/contentful-sdk-jsdoc/jsdoc-template',
		destination: './docs',
	},
	templates: {
		name: '780461 PJE40',
		footerText: '780461 - 2019',
	},
}
