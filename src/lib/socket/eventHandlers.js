import { isAdmin, emitError, trimSocket } from "./util.js";
import { InvalidRequestError } from "../../util/error.js";
import { EVENTS, ROOMS } from "./constants.js";
import { socketioLogger as logger } from "../../util/logger.js";

export function Connected(sm, socket) {
    logger.info('Connected', JSON.parse(trimSocket(socket)));
    socket.onAny((event, ...args) => {
        logger.event('<<', JSON.parse(trimSocket(socket, { event: event, args: args })));
    });

    socket.prependAny((event, ...args) => {
        logger.event('>>', JSON.parse(trimSocket(socket, { event: event, args: args })));
    });
    sm.connections += 1;
}

export function Disconnect(sm, socket, data) {
    logger.info('Disconnected', JSON.parse(trimSocket(socket, { reason: data })))
    sm.connections -= 1;

    if (socket.system_id && socket.node_id) {
        const system_id = socket.system_id;
        const node_id = socket.node_id;
        const system = sm.systems[system_id];
        const event = system.disconnectNode(node_id);
        sm.io.to(ROOMS.ADMIN).emit(event, { id: node_id, system: system_id });
    }
}

export function AdminConnect(sm, socket, data) {
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

export function NodeConnect(sm, socket, data) {
    const { id, name, system, root } = data;
    if (!id || !name || !system || !root) {
        emitError(socket, InvalidRequestError('Invalid registration data'));
        return;
    }

    const sys = sm.systems[system];
    if (sys) {
        try {
            const event = sys.connectNode(id, name, socket, root);
            sm.io.to(ROOMS.ADMIN).emit(event, { id: id, system: system });
        } catch (error) {
            emitError(socket, InvalidRequestError(error.message));
            return;
        }
    } else {
        emitError(socket, InvalidRequestError(`System: "${system}" does not exist`));
        return;
    }
}

export function NodeData(sm, socket, data) {
    return;
}

export function NodeRemove(sm, socket, data) {
    const { token, id, system } = data;
    if (!token || !id || !system) {
        emitError(socket, InvalidRequestError());
        return;
    }

    isAdmin(socket, () => {
        const sys = sm.systems[system];
        if (sys) {
            try {
                const { event, socket } = sys.removeNode(id);
                if (socket) socket.emit(EVENTS.DISCONNECT, { msg: 'Disconnected: Removed by administrator' });
                sm.io.to(ROOMS.ADMIN).emit(event, { id: id, system: system });
            } catch (error) {
                emitError(socket, InvalidRequestError(error.message));
                return;
            }
        } else {
            emitError(socket, InvalidRequestError(`System: "${system}" does not exist`));
            return;
        }
    });
}