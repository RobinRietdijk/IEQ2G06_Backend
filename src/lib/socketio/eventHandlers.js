import { isAdmin, emitError, trimSocket } from "./util.js";
import { InvalidRequestError } from "../../util/error.js";
import { EVENTS, ROOMS } from "../../util/constants.js";
import { socketioLogger as logger } from "../../util/logger.js";
import SystemController from "../oracle/SystemController.js";

const sc = new SystemController();

export function connection(sm, socket) {
    logger.info('Connected', JSON.parse(trimSocket(socket)));
    socket.onAny((event, ...args) => {
        logger.event('<<', JSON.parse(trimSocket(socket, { event: event, args: args })));
    });

    socket.onAnyOutgoing((event, ...args) => {
        logger.event('>>', JSON.parse(trimSocket(socket, { event: event, args: args })));
    });
    sm.connections += 1;
}

export function disconnect(sm, socket, data) {
    logger.info('Disconnected', JSON.parse(trimSocket(socket, { reason: data })))
    sm.connections -= 1;

    const node_id = socket.node_id
    if (node_id) {
        try {
            const node = sc.getNode(node_id);
            node.disconnect();
            sm.io.to(ROOMS.ADMIN).emit(EVENTS.NODE_DISCONNECTED, { node: node });
        } catch (error) {
            emitError(socket, InvalidRequestError(error.message));
        }
    }
}

export function adminConnect(sm, socket, data) {
    isAdmin(socket, () => {
        socket.join(ROOMS.ADMIN);
        socket.emit(EVENTS.ADMIN_INIT, {
            systems: sc.getSystems(),
            nodes: sc.getNodes(),
        });
    });
}

export function nodeConnect(sm, socket, data) {
    const { node_id, node_name, system_id, root } = data;
    if (!node_id || !node_name || !system_id || !root) {
        emitError(socket, InvalidRequestError('Invalid connection data'));
        return;
    }

    try {
        const node = sc.connectNode(socket, node_id, node_name, system_id, root);
        sm.io.to(ROOMS.ADMIN).emit(EVENTS.NODE_CONNECTED, { node: node });
    } catch (error) {
        emitError(socket, InvalidRequestError(error.message));
    }
}


export function nodeRemove(sm, socket, data) {
    const { node_id } = data;
    if (!node_id) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    isAdmin(socket, (sm, socket, data) => {
        try {
            const node = sc.removeNode(data.node_id);
            sm.io.to(ROOMS.ADMIN).emit(EVENTS.NODE_REMOVED, { node: node });
        } catch (error) {
            emitError(socket, InvalidRequestError(error.message));
        }
    }, sm, socket, data);
}

export function nodeData(sm, socket, data) {
    const { data: node_data } = data;
    const node_id = socket.node_id;
    if (!node_id || !node_data ) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    try {
        const node = sc.getNode(node_id);
        node.setData(node_data);
    } catch (error) {
        emitError(socket, InvalidRequestError(error.message));
    }
}

export function systemCreate(sm, socket, data) {
    const { system_name } = data;
    if (!system_name) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    isAdmin(socket, (sm, socket, data) => {
        try {
            const system = sc.createSystem(data.system_id, data.system_name, data.max_nodes);
            sm.io.to(ROOMS.ADMIN).emit(EVENTS.SYSTEM_CREATED, { system: system });
        } catch (error) {
            emitError(socket, InvalidRequestError(error.message));
        }
    }, sm, socket, data);
}

export function systemRemove(sm, socket, data) {
    const { system_id } = data;
    if (!system_id) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    isAdmin(socket, (sm, socket, data) => {
        try {
            const system = sc.removeSystem(data.system_id);
            sm.io.to(ROOMS.ADMIN).emit(EVENTS.SYSTEM_REMOVED, { system: system });
        } catch (error) {
            emitError(socket, InvalidRequestError(error.message));
        }
    }, sm, socket, data);
}

export function systemUpdate(sm, socket, data) {
    const { system_id } = data;
    if (!system_id) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    isAdmin(socket, (sm, socket, data) => {
        try {
            const system = sc.updateSystem(data.system_id, data.system_name, data.max_nodes);
            sm.io.to(ROOMS.ADMIN).emit(EVENTS.SYSTEM_UPDATED, { system: system });
        } catch (error) {
            emitError(socket, InvalidRequestError(error.message));
        }
    }, sm, socket, data);
}