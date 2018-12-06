const http = require('http')
const express = require('../server')
const log = require('../logger')

const PORT = process.env.PORT || 5000

const server = http.createServer(express)

server.listen(PORT)

server.on('listening', () => {
	log.info(`server listening on ${PORT}`, {
		file: 'bin/www.js',
		func: 'listen()',
	})
})
