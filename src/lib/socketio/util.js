import { socketioLogger as logger } from "../../util/logger.js";
import { EVENTS } from "../../util/constants.js";

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