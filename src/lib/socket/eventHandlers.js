import { isAdmin, emitError, trimSocket } from "./util.js";
import { InvalidRequestError } from "../../util/error.js";
import { EVENTS, ROOMS } from "./constants.js";
import { socketioLogger as logger } from "../../util/logger.js";
import Node from '../oracle/Node.js'

export function connected(sm, socket) {
    logger.info('Connected', JSON.parse(trimSocket(socket)));
    socket.onAny((event, ...args) => {
        logger.event('<<', JSON.parse(trimSocket(socket, { event: event, args: args })));
    });

    socket.prependAny((event, ...args) => {
        logger.event('>>', JSON.parse(trimSocket(socket, { event: event, args: args })));
    });
    sm.connections += 1;
}

export function disconnect(sm, socket, data) {
    logger.info('Disconnected', JSON.parse(trimSocket(socket, { reason: data })))
    sm.connections -= 1;

    const node_id = socket.node_id
    if (node_id) {
        const node = sm.node[node_id];
        if (!node) {
            emitError(socket, InvalidRequestError(`Node: "${node_id}" does not exist`));
            return;
        }

        if (!node.isConnected()) {
            emitError(socket, InvalidRequestError(`Node: "${node_id}" is not connected`));
            return;
        }

        node.disconnect();
        sm.io.to(ROOMS.ADMIN).emit(EVENTS.NODE_DISCONNECTED, { node: node });
    }
}

export function adminConnect(sm, socket, data) {
    const { token } = data;
    if (!token) {
        emitError(socket, InvalidRequestError('Unauthorized request'));
        return;
    }

    isAdmin(socket, () => {
        socket.join(ROOMS.ADMIN);
        socket.emit(EVENTS.ADMIN_INIT, {
            nodes: sm.nodes,
        });
    });
}

export function nodeConnect(sm, socket, data) {
    const { node_id, name, system_id, root } = data;
    if (!node_id || !name || !system_id || !root) {
        emitError(socket, InvalidRequestError('Invalid connection data'));
        return;
    }

    const system = sm.systems[system_id];
    if (!system) {
        emitError(socket, InvalidRequestError(`System: "${system_id}" does not exist`));
        return;
    }

    let node = sm.nodes[node_id]
    if (node) {
        if (node.isConnected()) {
            emitError(socket, InvalidRequestError(`Node: "${node_id}" is already connected`));
            return;
        }
        node.connect(socket);
        sm.io.to(ROOMS.ADMIN).emit(EVENTS.NODE_CONNECTED, { node: node });
    } else {
        if (root && system.root) {
            emitError(socket, InvalidRequestError(`System: "${system_id}" already has a root`));
            return;
        }

        node = new Node(node_id, name, system_id);
        system.addNode(node, root);
        node.connect(socket);
        sm.io.to(ROOMS.ADMIN).emit(EVENTS.NODE_CREATED, { node: node });
    }
}


export function nodeRemove(sm, socket, data) {
    const { token, node_id } = data;
    if (!token || !node_id) {
        emitError(socket, InvalidRequestError());
        return;
    }

    isAdmin(socket, (sm, socket, data) => {
        const { node_id } = data;
        const node = sm.nodes[node_id];
        
        if (!node) {
            emitError(socket, InvalidRequestError(`Node: "${node_id}" does not exist`));
            return;
        }

        const system = sm.systems[node.system_id];
        if (system) system.removeNode(node_id);

        const node_socket = node.socket;
        if (node_socket) node_socket.emit(EVENTS.DISCONNECT, { msg: 'Disconnected: Removed by administrator' });

        delete sm.nodes[node_id]
        sm.io.to(ROOMS.ADMIN).emit(EVENTS.NODE_REMOVED, { node: node });
    }, sm, socket, data);
}

export function nodeUpdate(sm, socket, data) {

}

export function nodeData(sm, socket, data) {

}

export function systemCreate(sm, socket, data) {

}

export function systemRemove(sm, socket, data) {

}

export function systemUpdate(sm, socket, data) {

}