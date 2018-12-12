const path = require('path')

module.exports = [
	{
		entry: path.join(__dirname, 'src', 'client', 'index.jsx'),
		output: {
			path: path.join(__dirname, 'public', 'js'),
			filename: 'client.bundle.js',
		},
		resolve: {
			modules: [
				'node_modules',
			],
			// directories where to look for modules
			extensions: ['.js', '.json', '.jsx', '.css'],
		},
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: [
								['@babel/plugin-transform-react-jsx', {pragma: 'h'}],
							],
						},
					},
				},
			],
		},
	},
]


// {
// 	"plugins": [
// 	  ["@babel/plugin-transform-react-jsx", { "pragma":"h" }]
// 	]
//   }
