/// node_modules
import winston, { createLogger, format, transports } from 'winston';
import fs from 'fs';
import config from '@/config';
import DailyRotateFile from 'winston-daily-rotate-file';


const { combine, timestamp, printf, align, colorize, errors, json } = format;

['logs/combined', 'logs/error', 'logs/exceptions'].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// logging format
const loggingFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length
    ? `\n ${JSON.stringify(meta)}`
    : '';
  return ` ${timestamp} : [${level}] : ${message} : ${metaString}`;
});

// logging transport options
const consoleTransport = new transports.Console({
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    loggingFormat
  ),
});

const rotatingCombinedTransport = new DailyRotateFile({
  filename: 'logs/combined/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  level: 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
});

const errorLogFile = new DailyRotateFile({
  filename: 'logs/error/%DATE%.error.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxFiles: '30d',
  format: combine(timestamp(), errors({ stack: true }), json()),
});

const exceptionHandlerFile = new transports.File({
  filename: 'logs/exceptions/exceptions.log',
  format: combine(timestamp(), json()),
});

// logging transport
const logTransport: winston.transport[] = [];

if (config.ENV === 'development') {
  logTransport.push(consoleTransport);
} else if (config.ENV === 'production') {
  logTransport.push(rotatingCombinedTransport, errorLogFile);
}

// logger
const logger = createLogger({
  level: config.LOG_LEVEL,
  transports: logTransport,
  silent: config.ENV === 'test',
});

// exception handle
logger.exceptions.handle(exceptionHandlerFile);

process.on('unhandledRejection', (err) => {
logger.error('Unhandled Rejection', { message: err, stack: err });
});

export default logger;
