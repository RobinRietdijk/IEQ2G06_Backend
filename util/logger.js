import winston from 'winston';
const format = winston.format
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.colorize({ level: true }),
        format.align(),
        format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss A'
        }),
        format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/server.log' }),
    ],
});

export default logger;