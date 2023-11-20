import { Server } from "socket.io"
import { EVENTS } from "../../util/constants.js";
import { adminConnect, connection, disconnect, nodeConnect, nodeData } from "./eventHandlers.js";

const DEFAULT_OPTIONS = {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    },
    cors: {
        origin: '*',
    }
};

export default class SocketController {
    static #instance;
    constructor() {
        if (!SocketController.#instance) SocketController.#instance = this;
        return SocketController.#instance;
    }
    
    initSocketController(httpServer, opts=DEFAULT_OPTIONS) {
        if (this.io) throw new Error('SocketController has already been initialized');
        this.io = new Server(httpServer, opts);
        this.initListeners();
        this.connections = 0;
    }

    isInitiated() {
        return Boolean(this.io);
    }

    emitTo(room, event, data) {
        if (!this.isInitiated()) throw new Error('SocketController has not been initiated yet');
        const io = this.getIO();
        io.to(room).emit(event, data);
    }

    initListeners() {
        this.io.on(EVENTS.CONNECTION, (socket) => {
            connection(this, socket);
            socket.on(EVENTS.DISCONNECT, (data) => disconnect(this, socket, data));
            socket.on(EVENTS.PING, () => socket.emit(EVENTS.PONG));
            socket.on(EVENTS.NODE_CONNECT, (data) => nodeConnect(this, socket, data));
            socket.on(EVENTS.NODE_DATA, (data) => nodeData(this, socket, data));
            socket.on(EVENTS.ADMIN_CONNECT, (data) => adminConnect(this, socket, data));
        });
    }
}