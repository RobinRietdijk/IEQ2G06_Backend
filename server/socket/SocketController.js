import { Server } from "socket.io"
import { NODE_ENV, EVENTS, UPS } from "../utils/constants";
import { instrument } from "@socket.io/admin-ui";
import { appLogger as logger } from "../utils/logger";
import handlers from "./handlers";

const DEFAULT_OPTIONS = {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
        credentials: true,
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

    initSocketController(httpServer, opts = DEFAULT_OPTIONS) {
        if (this.io) throw new Error('SocketController has already been initialized');
        this.io = new Server(httpServer, opts);

        instrument(this.io, {
            auth: false,
            mode: NODE_ENV,
        });

        this.#initListeners();
        this.#initDataLoop();
        this.connections = 0;
        this.node_clients = {};
        this.nodes = {};
    }

    isInitialized() {
        return Boolean(this.io);
    }

    emitTo(room, event, data) {
        if (!this.isInitialized()) throw new Error('SocketController has not been initiated yet');
        this.io.to(room).emit(event, data);
    }

    #initListeners() {
        this.io.on(EVENTS.CONNECTION, (socket) => {
            handlers.connection(this, socket, {});
            socket.on(EVENTS.DISCONNECT, (data) => handlers.disconnect(this, socket, data));
            socket.on(EVENTS.NODE_CONNECT, (data) => handlers.nodeConnect(this, socket, data));
            socket.on(EVENTS.NODE_DATA, (data) => handlers.nodeData(this, socket, data));
        });
    }

    #checkChangedData() {
        const rooms = this.io.sockets.adapter.rooms;
        for (const room in rooms) if (room) this.#checkRoomChangedData(room);
    }
    
    #checkRoomChangedData(room) {
        const socketsInRoom = this.io.sockets.adapter.rooms[room].sockets;
        const systemPackage = {};
        let changed = false;
        for (const socketId in socketsInRoom) {
            const node = this.node_clients[socketId];
    
            if (node) {
                if (node.hasChanged()) changed = true;
                systemPackage[node.getId()] = node.getData();
            }
        }

        if (changed) this.emitTo(room, EVENTS.SYSTEM_DATA, { system_data: systemPackage })
    }

    #initDataLoop() {
        setInterval(() => {
            try {
                this.#checkChangedData();
            } catch (error) {
                logger.error(error);
            }
        }, 1000 / UPS);
    }
}