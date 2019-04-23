const express = require('express')
const logger = require('morgan') // logs nicely
const compression = require('compression') // compresses responses
const helmet = require('helmet') // sets secure headers
const path = require('path')
const parser = require('body-parser')
const auth = require('./src/server/auth')
const {stream} = require('./src/server/logger')
const fhirApi = require('./src/server')

const app = express()
const pub = path.join(process.cwd(), 'public')

// log an IP thanks to nginx forwarding
logger.token('remote-addr', req => req.headers['x-forwarded-for'] || req.ip)

// log and save to logfile with winston
// todo: clean this up
app.use(logger('dev', {stream}))

app.use(compression())
app.use(helmet())

// accept json and url params
app.use(parser.json())
app.use(parser.json({type: 'application/fhir+json'}))
app.use(parser.urlencoded({extended: true}))

// statically server public files
app.use(express.static(pub))
// ensure login

app.use('/patient', express.static(path.join(process.cwd(), 'patient')))
app.use('/docs/js', express.static(path.join(process.cwd(), 'docs')))

app.use(fhirApi)

app.get('*', (req, res) => res.sendFile(path.join(pub, 'index.html')))


module.exports = app
