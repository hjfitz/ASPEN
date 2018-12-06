const express = require('express')
const logger = require('morgan') // logs nicely
const compression = require('compression') // compresses responses
const helmet = require('helmet') // sets secure headers
const path = require('path')
const parser = require('body-parser')
const winston = require('./logger')

const app = express()
const pub = path.join(process.cwd(), 'public')

// log and save to logfile with winston
app.use(logger({ stream: winston.stream }))

app.use(compression())
app.use(helmet())

// accept json and url params
app.use(parser.json())
app.use(parser.urlencoded({ extended: true }))

// statically server public files
app.use(express.static(pub))


module.exports = app
