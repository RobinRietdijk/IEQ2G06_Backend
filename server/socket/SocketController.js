import { Server } from "socket.io"
import { NODE_ENV, EVENTS, UPS } from "../utils/constants";
import { instrument } from "@socket.io/admin-ui";
import { appLogger as logger } from "../utils/logger";
import { connection, disconnect, gptPrompt, nodeConnect, nodeData, print } from "./handlers";
import System from "./System";
import ChatGPT from "../utils/ChatGPT";

const MAX_DISCONNECT_DURATION = 2 * 60 * 1000
const IDLE_TIMEOUT = 1 * 60 * 1000;
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
    #systems;

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

        this.chatGPT = new ChatGPT();
        this.#initListeners();
        this.#initDataLoop();
        this.#initCleanupLoop();
        this.#initIdleLoop();
        this.connections = 0;
        this.#systems = {};
    }

    isInitialized() {
        return Boolean(this.io);
    }

    emitTo(room, event, data) {
        if (!this.isInitialized()) throw new Error('SocketController has not been initiated yet');
        this.io.to(room).emit(event, data);
    }

    getSystem(system_id) {
        return this.#systems[system_id];
    }

    getSystemFromSocket(socket_id) {
        for (const [key, system] of Object.entries(this.#systems)) {
            const node = system.getNode(socket_id);
            if (node) return this.#systems[key];
        }
        throw new Error("Cannot find system from socket id");
    }

    createSystem(system_id) {
        this.#systems[system_id] = new System(this.io, system_id);
        return this.#systems[system_id];
    }

    getNode(socket_id) {
        for (const system of Object.values(this.#systems)) {
            const node = system.getNode(socket_id);
            if (node) return node;
        }
        throw new Error("Cannot find node from socket id");
    }

    #initListeners() {
        this.io.on(EVENTS.CONNECTION, (socket) => {
            connection(this, socket, {});
            socket.on(EVENTS.DISCONNECT, (data) => disconnect(this, socket, data));
            socket.on(EVENTS.NODE_CONNECT, (data) => nodeConnect(this, socket, data));
            socket.on(EVENTS.NODE_DATA, (data) => nodeData(this, socket, data));
            socket.on(EVENTS.GPT_PROMPT, (data) => gptPrompt(this, socket, data));
            socket.on(EVENTS.PRINT, (data) => print(this, socket, data));
        });
    }

    #initDataLoop() {
        setInterval(() => {
            try {
                for (const system of Object.values(this.#systems)) system.dataLoop();
            } catch (error) {
                logger.error(error);
            }
        }, 1000 / UPS);
    }

    #initCleanupLoop() {
        setInterval(() => {
            try {
                for (const [key, system] of Object.entries(this.#systems)) {
                    system.cleanupLoop(MAX_DISCONNECT_DURATION);
                    if (system.size() < 1) delete this.#systems[key];
                }
            } catch (error) {
                logger.error(error);
            }
        }, MAX_DISCONNECT_DURATION);
    }

    #initIdleLoop() {
        setInterval(() => {
            try {
                for (const system of Object.values(this.#systems)) {
                    system.idleLoop(IDLE_TIMEOUT);
                }
            } catch (error) {
                logger.error(error);
            }
        }, IDLE_TIMEOUT);
    }
}