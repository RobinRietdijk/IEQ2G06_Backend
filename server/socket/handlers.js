import { emitError, trimSocket } from "./utils";
import { socketioLogger as logger } from "../utils/logger";
import { EVENTS, PROMPT, ROOMS, STATES, UPS, URL } from "../utils/constants";
import { InternalServerError, InvalidRequestError } from "../utils/error";
import { generateImageOfElement } from "../utils/puppeteer";

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

export function printerConnect(ioc, socket, data) {
    socket.join(ROOMS.PRINTER);
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
    if (!system_data || !system_data.color || !system_data.location || !system_data.weather_location) {
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
        const location = system_data.location;
        const time = new Date().toLocaleDateString('en-us', {
            dateStyle: 'full',
            timeStyle: 'short',
        });
        const apiKey = process.env.WEATHERAPIKEY;
        const weatherLocation = system_data.weather_location
        const weatherRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${weatherLocation}&appid=${apiKey}`);
        const weatherResJson = weatherRes.json()
        const weather = `${weatherResJson.main.temp - 273.15}°C: ${weatherResJson.weather[0].description}`;
        const prompt = PROMPT(color, time, weather, location);

        const gptRes = await ioc.chatGPT.sendMessage(prompt);
        const parsedAnswer = gptRes.text.replace(/\n/g, '<br>');
        const image = await generateImageOfElement(system.getSystemId(), parsedAnswer, color);
        ioc.to(ROOMS.PRINTER).emit(EVENTS.PRINT, { system_id: system.getSystemId(), image: image });

        system.setState(STATES.PRINTING);
    } catch (error) {
        system.setState(STATES.ERROR)
        emitError(socket, InternalServerError(error));
        logger.error(error);
    }
}