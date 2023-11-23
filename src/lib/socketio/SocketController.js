import { Server } from "socket.io"
import { EVENTS, ROOMS } from "../../util/constants.js";
import { connection, disconnect, nodeConnect, nodeData } from "./eventHandlers.js";
import SystemController from "../oracle/SystemController.js";
import { appLogger as logger } from "../../util/logger.js";

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
    
    initSocketController(httpServer, opts=DEFAULT_OPTIONS, ups=1) {
        if (this.io) throw new Error('SocketController has already been initialized');
        this.io = new Server(httpServer, opts);
        (async () => {
            this.sc = new SystemController();
            this.sc.initialize();
        })();
        this.ups=ups;
        this.initListeners();
        this.initDataLoop();
        this.connections = 0;
    }

    isInitialized() {
        return Boolean(this.io);
    }

    emitTo(room, event, data) {
        if (!this.isInitialized()) throw new Error('SocketController has not been initiated yet');
        this.io.to(room).emit(event, data);
    }

    initListeners() {
        this.io.on(EVENTS.CONNECTION, (socket) => {
            connection(this, socket);
            socket.on(EVENTS.DISCONNECT, (data) => disconnect(this, socket, data));
            socket.on(EVENTS.PING, () => socket.emit(EVENTS.PONG));
            socket.on(EVENTS.NODE_CONNECT, (data) => nodeConnect(this, socket, data));
            socket.on(EVENTS.NODE_DATA, (data) => nodeData(this, socket, data));
        });
    }

    initDataLoop() {
        setInterval(() => {
            try {
                const system_packages = {};
                const systems = this.sc.getSystems();
                for (const system of Object.values(systems)) {
                    const data_package = system.createDataPackage();
                    if (system.hasRoot()) {
                        const root = system.getRoot();
                        if (root.isConnected()) root.emit(EVENTS.SYSTEM_DATA, { data: data_package });
                    }
                    system_packages[system.id] = data_package;
                }

                this.io.to(ROOMS.SPECTATOR).emit(EVENTS.SYSTEMS_DATA, { data: system_packages });
            } catch (error) {
                logger.error(error.message);
            }
        }, 1000 / this.ups);
    }
}