const express = require('express')
const logger = require('morgan') // logs nicely
const compression = require('compression') // compresses responses
const helmet = require('helmet') // sets secure headers
const path = require('path')
const parser = require('body-parser')
const winston = require('./logger')

const app = express()

app.use(
	logger({ stream: winston.stream }),
	compression(),
	helmet(),
	parser.json(),
	parser.urlencoded({ extended: true }),
	express.static(path.join(__dirname, 'public')),
)

module.exports = app
