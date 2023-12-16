import { emitError, trimSocket, sleepUntil } from "./utils";
import { socketioLogger as logger } from "../utils/logger";
import { EVENTS, PROMPT, STATES, UPS, URL } from "../utils/constants";
import { InternalServerError, InvalidRequestError } from "../utils/error";
import { generateImageOfElement } from "../utils/puppeteer";
import { exec } from 'child_process';

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

export function nodeActivated(ioc, socket, data) {
    const node = ioc.getNode(socket.id);
    if (!node) {
        emitError(socket, InvalidRequestError('Node does not exist, register the node before sending data'));
        return;
    }
    const system = ioc.getSystemFromSocket(socket.id);
    if (!system) {
        emitError(socket, InternalServerError('Node is not connected to a system'));
    }

    if (system.getState === STATES.ACTIVE) return;
    system.setState(STATES.ACTIVE);
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

    if (system.getState() !== STATES.ACTIVE) {
        return
    }

    try {
        system.setState(STATES.PROMPTING);
        const color = system_data.color;
        const timeout = system_data.timeout || 60 * 1000;
        const prompt = PROMPT(color);
        const answer = await ioc.chatGPT.sendMessage(prompt);
        const image = await generateImageOfElement(system.getSystemId(), answer.text, color);
        system.emit(EVENTS.PRINT, { image: image });
        system.setState(STATES.PRINTING);
        let printTimeout;

        const printCompleteListener = () => {
            clearTimeout(printTimeout);
            system.setState(STATES.INACTIVE);
            setTimeout(() => { system.setState(STATES.IDLE) }, timeout);

            system.removeListener(EVENTS.PRINT_COMPLETE, printCompleteListener);
        };

        printTimeout = setTimeout(() => {
            system.removeListener(EVENTS.PRINT_COMPLETE, printCompleteListener);
            system.setState(STATES.INACTIVE);
            setTimeout(() => { system.setState(STATES.IDLE) }, timeout);
        }, 180 * 1000);

        system.on(EVENTS.PRINT_COMPLETE, printCompleteListener);
    } catch (error) {
        system.setState(STATES.ERROR)
        emitError(socket, InternalServerError(error));
        logger.error(error);
    }
}