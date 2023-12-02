import { emitError, trimSocket } from "./utils";
import { socketioLogger as logger } from "../utils/logger";
import Node from "./Node";
import { EVENTS, UPS } from "../utils/constants";

export function connection(ioc, socket, data) {
    logger.info('Connected', JSON.parse(trimSocket(socket)));
    socket.onAny((event, ...args) => {
        logger.event('<<', JSON.parse(trimSocket(socket, { event: event, args: args })));
    });

    socket.onAnyOutgoing((event, ...args) => {
        logger.event('>>', JSON.parse(trimSocket(socket, { event: event, args: args })));
    });

    ioc.connections += 1;
}

export function disconnect(ioc, socket, data) {
    logger.info('Disconnected', JSON.parse(trimSocket(socket, { reason: data })))
    ioc.connections -= 1;

    if (ioc.node_clients[socket.id]) {
        const node = ioc.node_clients[socket.id];
        node.disconnect();
        delete ioc.node_clients[socket.id];
    }
}

export function nodeConnect(ioc, socket, data) {
    const { node_id, system_id, data: node_data } = data;
    if (!node_id || !system_id) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    let node = ioc.nodes[node_id];
    if (!node) node = new Node(node_id);
    if (node.isConnected()) {
        emitError(socket, InvalidRequestError('Node already connected'));
        return;
    }

    node.connect(socket);
    node.setData(node_data);
    
    ioc.node_clients[socket.id] = node;
    socket.join(system_id);

    socket.emit(EVENTS.NODE_CONNECTED, { server_ups: UPS });
}

export function nodeData(ioc, socket, data) {
    const { data: node_data } = data;
    if (!node_data ) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    ioc.node_clients[socket.id].setData(node_data);
}