import morgan from 'morgan';
import { httpLogger } from '../utils/logger';

export const requestLogger = morgan(
    function (tokens, req, res) {
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number.parseFloat(tokens.status(req, res)),
            content_length: tokens.res(req, res, 'content-length') || '-',
            response_time: Number.parseFloat(tokens['response-time'](req, res)),
            remote_addr: tokens['remote-addr'](req, res) || '-',
            remote_user: tokens['remote-user'](req,res) || '-',
            http_version: tokens['http-version'](req, res),
            user_agent: tokens['user-agent'](req, res),
            referer: tokens.referrer(req) || '-',
        });
    },
    {
        stream: {
            write: (message) => {
                const data = JSON.parse(message);
                httpLogger.http(`<<`, data);
            },
        },
    }
);

export const responseLogger = morgan(
    function (tokens, req, res) {
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number.parseFloat(tokens.status(req, res)),
            content_length: tokens.res(req, res, 'content-length') || '-',
            response_time: Number.parseFloat(tokens['response-time'](req, res)),
            remote_addr: tokens['remote-addr'](req, res) || '-',
            remote_user: tokens['remote-user'](req,res) || '-',
            http_version: tokens['http-version'](req, res),
            user_agent: tokens['user-agent'](req, res),
            referer: tokens.referrer(req) || '-',
        });
    },
    {
        stream: {
            write: (message) => {
                const data = JSON.parse(message);
                httpLogger.http(`>>`, data);
            }
        }
    }
)