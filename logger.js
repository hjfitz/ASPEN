const { createLogger, format, transports } = require('winston')
const dFormat = require('date-fns/format')

const { combine, timestamp, printf, colorize } = format
const level = process.env.LOG_LEVEL || 'info'
const getFileTimestamp = () => dFormat(new Date(), 'DD-MMM-YYYY')


const logFormat = combine(
	colorize(),
	timestamp(),
	printf(info => `${info.timestamp} [${info.level}]: ${info.message} (in ${info.file}@${info.func})`),
)


const logger = createLogger({
	level,
	format: logFormat,
	transports: [
		new transports.Console(),
		new transports.File({ filename: `error-${getFileTimestamp()}.log`, level: 'error' }),
		new transports.File({ filename: `all-${getFileTimestamp()}.log` }),
	],
})

logger.stream = {
	write: message => logger.log('info', message, { file: 'server.js', func: 'request' }),
}


logger.log('info', `Creating logfile with name ${getFileTimestamp()}`, {
	file: 'logger.js',
	func: 'create',
})

module.exports = logger
