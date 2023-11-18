import { Server } from "socket.io"
import { EVENTS } from "./constants.js";
import { AdminConnect, Connected, Disconnect, NodeConnect, NodeData, NodeRemove } from "./eventHandlers.js";

const DEFAULT_OPTIONS = {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    },
    cors: {
        origin: '*',
    }
};

export default class SocketManager {
    constructor(httpServer, opts = DEFAULT_OPTIONS) {
        if (!SocketManager.instance) {
            SocketManager.instance = this;
            this.io = new Server(httpServer, opts);
            this.initListeners();
            this.connections = 0;
            this.systems = {};
        }

        return SocketManager.instance;
    }

    initListeners() {
        this.io.on(EVENTS.CONNECTED, (socket) => {
            Connected(this, socket);
            socket.on(EVENTS.ADMIN_CONNECT, (data) => AdminConnect(this, socket, data));
            socket.on(EVENTS.NODE_CONNECT, (data) => NodeConnect(this, socket, data));
            socket.on(EVENTS.NODE_DATA, (data) => NodeData(this, socket, data));
            socket.on(EVENTS.NODE_REMOVE, (data) => NodeRemove(this, socket, data));
            socket.on(EVENTS.DISCONNECT, (data) => Disconnect(this, socket, data));
        });
    }
}