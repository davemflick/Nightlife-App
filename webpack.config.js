var webpack = require('webpack');

module.exports = {
	entry: [
	'./src/app.js'
	],
	output: {
		filename: 'public/build/bundle.js',
		sourceMapFilename: 'public/build/bundle.map'
	},
	module: {
		loaders: [
		{test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ["react", "es2015"]}},
		]
	},
}