const {createLogger, format, transports} = require('winston')
const dFormat = require('date-fns/format')
const fs = require('fs')
const path = require('path')
const split = require('split')

const {combine, timestamp, printf, colorize} = format
const level = 'silly'
const getFileTimestamp = () => dFormat(new Date(), 'DD-MMM-YYYY')


const logFormat = combine(
	colorize(),
	timestamp(),
	printf(info => `${info.timestamp} [${info.level}]: ${info.message} (in ${info.file}@${info.func})`),
)

// make sure we can save to the dir first
const logLoc = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logLoc)) fs.mkdirSync(logLoc)

const logger = createLogger({
	level,
	format: logFormat,
	transports: [
		new transports.Console(),
		new transports.File({filename: `./logs/error-${getFileTimestamp()}.log`, level: 'error'}),
		new transports.File({filename: `./logs/all-${getFileTimestamp()}.log`}),
	],
})

// logger.stream = {
// 	write: message => logger.log('info', message, {file: 'server.js', func: 'request'}),
// }


logger.log('info', `Creating logfile with name ${getFileTimestamp()}`, {
	file: 'logger.js',
	func: 'create',
})

module.exports = logger
module.exports.stream = split().on('data', message => logger.log('info', message, {file: 'server.js', func: 'request'}))
