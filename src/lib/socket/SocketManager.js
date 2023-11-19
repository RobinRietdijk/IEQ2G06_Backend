import { Server } from "socket.io"
import { EVENTS } from "./constants.js";
import { adminConnect, connected, disconnect, nodeConnect, nodeData, nodeRemove, nodeUpdate, systemCreate, systemRemove, systemUpdate } from "./eventHandlers.js";

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

            this.nodes = {};
            this.systems = {};
        }

        return SocketManager.instance;
    }

    initListeners() {
        this.io.on(EVENTS.CONNECTED, (socket) => {
            connected(this, socket);
            socket.on(EVENTS.DISCONNECT, (data) => disconnect(this, socket, data));
            socket.on(EVENTS.NODE_CONNECT, (data) => nodeConnect(this, socket, data));
            socket.on(EVENTS.NODE_REMOVE, (data) => nodeRemove(this, socket, data));
            socket.on(EVENTS.NODE_UPDATE, (data) => nodeUpdate(this, socket, data));
            socket.on(EVENTS.NODE_DATA, (data) => nodeData(this, socket, data));
            socket.on(EVENTS.SYSTEM_CREATE, (data) => systemCreate(this, socket, data));
            socket.on(EVENTS.SYSTEM_REMOVE, (data) => systemRemove(this, socket, data));
            socket.on(EVENTS.SYSTEM_UPDATE, (data) => systemUpdate(this, socket, data));
            socket.on(EVENTS.ADMIN_CONNECT, (data) => adminConnect(this, socket, data));
        });
    }
}