import { emitError, trimSocket, sleepUntil } from "./utils";
import { socketioLogger as logger } from "../utils/logger";
import { EVENTS, PROMPT, STATES, UPS, URL } from "../utils/constants";
import { InternalServerError } from "../utils/error";

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

    const node = ioc.getNode(socket.id);
    if (node) node.disconnect();
    else {
        emitError(socket, InvalidRequestError('Node is not connected'));
        return;
    }
}

export function nodeConnect(ioc, socket, data) {
    const { node_id, system_id, data: node_data } = data;
    if (!node_id || !system_id) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    let system = ioc.getSystem(system_id);
    if (!system) system = ioc.createSystem(system_id);

    let node = system.getNode(socket.id);
    if (!node) node = system.createNode(socket.id, node_id);

    if (node.isConnected()) {
        emitError(socket, InvalidRequestError('Node already connected'));
        return;
    }

    system.connectNode(socket, node_data);
    socket.emit(EVENTS.NODE_CONNECTED, { server_ups: UPS, state: system.getState() });
}

export function nodeData(ioc, socket, data) {
    const { node_data } = data;
    if (!node_data) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    const node = ioc.getNode(socket.id);
    if (!node) {
        emitError(socket, InvalidRequestError('Node does not exist, register the node before sending data'));
        return;
    }
    const system = ioc.getSystemFromSocket(socket.id);
    if (!system) {
        emitError(socket, InternalServerError('Node is not connected to a system'));
    }

    system.updateNodeData(socket, node_data);
}

export function nodeSetState(ioc, socket, data) {
    const { state } = data;
    if (!state) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    const node = ioc.getNode(socket.id);
    if (!node) {
        emitError(socket, InvalidRequestError('Node does not exist, register the node before sending data'));
        return;
    }
    const system = ioc.getSystemFromSocket(socket.id);
    if (!system) {
        emitError(socket, InternalServerError('Node is not connected to a system'));
    }

    system.setState(state);
}

export async function systemConclude(ioc, socket, data) {
    const { data: system_data } = data;
    if (!system_data) {
        emitError(socket, InvalidRequestError('Invalid request data'));
        return;
    }

    const node = ioc.getNode(socket.id);
    if (!node) {
        emitError(socket, InvalidRequestError('Node does not exist, register the node before sending data'));
        return;
    }
    const system = ioc.getSystemFromSocket(socket.id);
    if (!system) {
        emitError(socket, InternalServerError('Node is not connected to a system'));
    }

    try {
        system.setState(STATES.PROMPTING);
        const targetTime = new Date().getTime() + 10000
        const answer = await ioc.chatGPT.sendMessage(PROMPT(system_data.color));
        const color_encoded = encodeURIComponent(btoa(system_data.color));
        const poem_encoded = encodeURIComponent(btoa(answer));
        const url = `${URL}/card/${color_encoded}-${poem_encoded}`;
        
        await sleepUntil(targetTime);
        system.setState(STATES.PRINTING);
        setTimeout(() => { system.setState(STATES.INACTIVE) }, 10000);
    } catch (error) {
        system.setState(STATES.ERROR)
        emitError(socket, InternalServerError(error));
        logger.error(error);
    }
}