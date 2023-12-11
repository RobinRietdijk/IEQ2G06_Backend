import { Server } from "socket.io"
import { NODE_ENV, EVENTS, UPS } from "../utils/constants";
import { instrument } from "@socket.io/admin-ui";
import { appLogger as logger } from "../utils/logger";
import { connection, disconnect, nodeConnect, nodeData } from "./handlers";

const MAX_DISCONNECT_DURATION = 2 * 60 * 1000
const DEFAULT_OPTIONS = {
    connectionStateRecovery: {
        maxDisconnectionDuration: MAX_DISCONNECT_DURATION,
        skipMiddlewares: true,
        credentials: true,
    },
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
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
        this.#initCleanupLoop();
        this.connections = 0;
        this.node_clients = {};
        this.disconnected_node_clients = {};
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
            connection(this, socket, {});
            socket.on(EVENTS.DISCONNECT, (data) => disconnect(this, socket, data));
            socket.on(EVENTS.NODE_CONNECT, (data) => nodeConnect(this, socket, data));
            socket.on(EVENTS.NODE_DATA, (data) => nodeData(this, socket, data));
        });
    }

    #checkChangedData() {
        const rooms = this.io.sockets.adapter.rooms;
        for (const [room, sockets] of rooms.entries()) {
            if (sockets.size > 1 || (sockets.size === 1 && [...sockets][0] !== room)) {
                this.#checkRoomChangedData(room);
            }
        }
    }

    #checkRoomChangedData(room) {
        const socketsInRoom = [...this.io.sockets.adapter.rooms.get(room)];
        const systemPackage = {};
        let changed = false;
        for (const socketId of socketsInRoom) {
            const node = this.node_clients[socketId];
            if (node) {
                if (node.hasChanged()) changed = true;
                systemPackage[node.getId()] = node.getData();
            }
        }

        if (changed) this.emitTo(room, EVENTS.SYSTEM_DATA, { system_data: systemPackage })
    }

    #cleanup() {
        const now = new Date().getTime()
        for (const [key, value] of Object.entries(this.disconnected_node_clients)) {
            try {
                const disconnectedSince = value.getDisconnectedSince()
                if (disconnectedSince - now > MAX_DISCONNECT_DURATION) {
                    delete this.disconnected_node_clients[key];
                }
            } catch (error) {
                logger.warn(error);
            }
        }
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

    #initCleanupLoop() {
        setInterval(() => {
            try {
                this.#cleanup();
            } catch (error) {
                logger.error(error);
            }
        }, MAX_DISCONNECT_DURATION)
    }
}