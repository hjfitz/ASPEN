const path = require('path')
const webpack = require('webpack')

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
		devtool: 'source-map',
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
				{
					test: /\.scss$/,
					use: [
						{loader: 'style-loader'},
						{loader: 'css-loader'},
						{loader: 'sass-loader'}],
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('development'),
				},
			}),
		],
	},
]


// {
// 	"plugins": [
// 	  ["@babel/plugin-transform-react-jsx", { "pragma":"h" }]
// 	]
//   }
