import { UnauthorizedError } from "../../util/error.js";
import { socketioLogger as logger } from "../../util/logger.js";
import jwt from "jsonwebtoken";
import { EVENTS } from "./constants.js";
const SECRET = process.env.JWT_KEY || 'jwtsecret';

export function isAdmin(socket, callback, ...args) {
    const { auth } = socket.handshake;
    if (auth && auth.token) {
        try {
            const decoded = jwt.verify(auth.token, SECRET);
            if (decoded.isAdmin) callback(...args);
            else {
                emitError(socket, UnauthorizedError('Invalid token'));
            }
        } catch (error) {
            emitError(socket, UnauthorizedError('Token verification failed'));
        }
    }
}

export function emitError(socket, error, callback = () => { }) {
    logger.warn(error, JSON.parse(trimSocket(socket)));
    socket.emit(EVENTS.ERROR, { msg: error });
    callback();
}

export function trimSocket(socket, args = {}) {
    return JSON.stringify(Object.assign({
        id: socket.id,
        pid: socket.pid,
        url: socket.url,
        status: socket.recovered ? 'Recovered' : socket.connected ? 'Connected' : 'Disconnected',
        remote_addr: socket.handshake.address || '',
        user_agent: socket.handshake.headers['user-agent'] || '',
        referer: socket.handshake.headers.referer || '',
    }, args));
}