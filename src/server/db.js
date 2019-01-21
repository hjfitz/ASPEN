const pg = require('pg')
const logger = require('../../logger')

let isConnected = false

const client = new pg.Client(process.env.DATABASE_URL)

logger.info(`attempting to connect to postgres on ${process.env.DATABASE_URL}`, {file: 'server/db.js', func: 'main'})


async function connect() {
	if (isConnected) return
	await client.connect()
	logger.debug('successfully connected to database', {file: 'server/db.js', func: 'connect()'})
	isConnected = true
}

module.exports = {client, connect}
