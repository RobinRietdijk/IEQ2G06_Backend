import { Server } from "socket.io"
import { NODE_ENV, EVENTS, UPS } from "../utils/constants";
import { instrument } from "@socket.io/admin-ui";

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
        });
    }

    initDataLoop() {
        setInterval(() => {
            try {

            } catch (error) {

            }
        }, 1000 / UPS);
    }
}