const http = require('http')
const fs = require('fs')
const path = require('path')

// attempt to load .env file
const requiredVars = ['DATABASE_URL']
const envLoc = path.join(process.cwd(), '.env')
const toLog = [['debug', 'beginning bootstrap process', {func: 'main', file: 'bin/www.js'}]]
if (fs.existsSync(envLoc)) {
	toLog.push(['debug', `attempting to load .env from ${envLoc}`, {func: 'main', file: 'bin/www.js'}])
	const lines = fs.readFileSync(envLoc).toString().split('\n')
	lines.forEach((line) => {
		const [key, ...rest] = line.split('=')
		const val = rest.join('=')
		toLog.push(['debug', `setting [${key}] as [${val}]`, {func: 'lines.forEach', file: 'bin/www.js'}])
		process.env[key] = val
	})
	const keys = lines.map(line => line.split('=')).map(([k]) => k)
	const missing = requiredVars.filter(key => !keys.includes(key))
	missing.forEach((key) => {
		toLog.push(['error', `Missing "${key}" from .env file!`, {func: 'missing.forEach', file: 'bin/www.js'}])
	})
}


const log = require('../src/server/logger')

toLog.map(stream => log.log(...stream))
const express = require('../server')

const PORT = process.env.PORT || 5000
const server = http.createServer(express)

server.listen(PORT)

server.on('listening', () => {
	log.info(`server listening on ${PORT}`, {
		file: 'bin/www.js',
		func: 'listen()',
	})
})
