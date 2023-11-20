import winston from 'winston';
import wndf from 'winston-daily-rotate-file';
import chalk from 'chalk';
const format = winston.format;
const TIMESTAMP_COLOR = chalk.rgb(160, 160, 160);
const LABEL_COLOR = chalk.rgb(230, 190, 50);

const colors = {
    warn: 'yellow',
    http: 'cyan',
    event: 'cyan',
};
winston.addColors(colors);

const appLogFile = new winston.transports.DailyRotateFile({
    filename: './logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '3d',
});
const httpLogFile = new winston.transports.DailyRotateFile({
    filename: './logs/http-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '3d',
});
const socketLogFile = new winston.transports.DailyRotateFile({
    filename: './logs/socketio-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '3d',
});

const appLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'verbose',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.label({ label: "app", message: false }),
                format.printf(({ level, message, timestamp, label }) => {
                    return `${TIMESTAMP_COLOR(timestamp)} ${LABEL_COLOR(label)} [${level}]: ${message}`;
                }),
            ),
        }),
        appLogFile,
    ]
});

const httpLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'verbose',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.label({ label: "http", message: false }),
                format.printf(({ level, message, timestamp, label, ...meta }) => {
                    let log = `${TIMESTAMP_COLOR(timestamp)} ${LABEL_COLOR(label)} [${level}]: `
                    if (message === '<<' || message === '>>') {
                        log = log.concat(`${chalk.red(message)} ${meta.remote_addr} - ${meta.remote_user} "${meta.method} `
                            + `${meta.url} HTTP/${meta.http_version}" ${meta.status} ${meta.content_length} `);
                        if (message === '<<') {
                            return log.concat(`"${meta.referer}" "${meta.user_agent}`);
                        } else if (message === '>>') {
                            return log.concat(`- ${meta.response_time} ms`);
                        }
                    } else {
                        return log.concat(`${message}`);
                    }
                }),
            ),
        }),
        httpLogFile,
    ]
});

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    event: 3,
    verbose: 4,
    debug: 5,
    silly: 6
}
const socketioLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'verbose',
    levels: levels.levels,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.label({ label: "socketio", message: false }),
                format.printf(({ level, message, timestamp, label, ...meta }) => {
                    let log = `${TIMESTAMP_COLOR(timestamp)} ${LABEL_COLOR(label)} [${level}]: `

                    if (message == '<<' || message === '>>') {
                        return log.concat(`Socket ID: ${meta.id} - ${meta.remote_addr} ${chalk.red(message)} ${meta.event || ''} - ${JSON.stringify(meta.args)}`);
                    } else if (message === 'Connected' || message === 'Disconnected') {
                        log = log.concat(`Socket ID: ${meta.id} - ${meta.remote_addr} `);
                        
                        if (message === 'Connected') {
                            return log.concat(`${chalk.red(meta.status)} - "${meta.referer}" "${meta.user_agent}"`);
                        } else if (message === 'Disconnected') {
                            return log.concat(`${chalk.red('Disconnected')} - ${meta.reason || ''}`);
                        }
                    } else {
                        return log.concat(`Socket ID: ${meta.id} - ${meta.remote_addr} ${message}`);
                    }
                }),
            ),
        }),
        socketLogFile,
    ]
});

export {
    appLogger,
    httpLogger,
    socketioLogger,
};