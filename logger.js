const { createLogger, transports, format } = require('winston');
require('winston-daily-rotate-file');

if (!(process.env.LOG_DIR)) console.log('LOG_DIR is undefined. Logs dir is now ./logs');
const logDir = process.env.LOG_DIR || './logs';

const full = new transports.DailyRotateFile({
	filename: logDir + '/bot-full_%DATE%.log',

	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '21d'
});

const error = new transports.DailyRotateFile({
	filename: logDir + '/bot-error_%DATE%.log',
	level: 'error',

	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '21d'
});

const debug = new transports.Console({ 
	level: 'debug',
	format: format.combine(
        format.colorize(),
        format.simple()
    )
});

const logger = createLogger({
	format: format.combine(
		format.timestamp(),
		format.json(),
	),
 	transports: [
 		full,
 		error,
	]
});

if (process.env.LOG_LEVEL === 'debug') logger.add(debug);

module.exports = logger;