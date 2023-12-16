import { socketioLogger as logger } from "../utils/logger";
import { EVENTS } from "../utils/constants";

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

function sleepUntil(targetTime) {
    const currentTime = new Date().getTime();
    const timeToSleep = targetTime - currentTime;

    return new Promise(resolve => setTimeout(resolve, timeToSleep));
}