import { emitError, trimSocket } from "./util.js";
import { InvalidRequestError } from "../../util/error.js";
import { EVENTS, ROOMS, UPS } from "../../util/constants.js";
import { socketioLogger as logger } from "../../util/logger.js";
export function connection(ioc, socket) {
    logger.info('Connected', JSON.parse(trimSocket(socket)));
    socket.onAny((event, ...args) => {
        logger.event('<<', JSON.parse(trimSocket(socket, { event: event, args: args })));
    });

    socket.onAnyOutgoing((event, ...args) => {
        logger.event('>>', JSON.parse(trimSocket(socket, { event: event, args: args })));
    });

    if (socket.handshake.query.spectator) {
        socket.join(ROOMS.SPECTATOR);
        socket.emit(EVENTS.INITIALIZE, { systems: ioc.sc.getSystems() });
    }
    ioc.connections += 1;
}

export function disconnect(ioc, socket, data) {
    logger.info('Disconnected', JSON.parse(trimSocket(socket, { reason: data })))
    ioc.connections -= 1;

    const node_id = socket.node_id
    if (node_id) {
        try {
            const node = ioc.sc.getNode(node_id);
            node.disconnect();
            ioc.io.to(ROOMS.SPECTATOR).emit(EVENTS.NODE_DISCONNECTED, { node: node });
        } catch (error) {
            emitError(socket, InvalidRequestError(error.message));
        }
    }
}

export function nodeConnect(ioc, socket, data) {
    const { node_id, node_name, system_id, root, data: node_data } = data;
    if (!node_id || !node_name || !system_id) {
        emitError(socket, InvalidRequestError('Invalid connection data'));
        return;
    }

    try {
        const node = ioc.sc.connectNode(socket, node_id, node_name, system_id, root);
        if (node_data) node.setData(node_data);
        socket.leave(ROOMS.SPECTATOR);
        socket.emit(EVENTS.NODE_INIT, { server_ups: UPS });
        ioc.io.to(ROOMS.SPECTATOR).emit(EVENTS.NODE_CONNECTED, { node: node });
    } catch (error) {
        emitError(socket, InvalidRequestError(error.message));
    }
}

export function nodeData(ioc, socket, data) {
    const { node_id, data: node_data } = data;
    if (!node_id || !node_data ) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    try {
        const node = ioc.sc.getNode(node_id);
        node.setData(node_data);
    } catch (error) {
        emitError(socket, InvalidRequestError(error.message));
    }
}