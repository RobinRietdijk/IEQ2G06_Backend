import { Server } from "socket.io"
import { UnauthorizedError, InvalidRequestError } from "../util/error.js";
import jwt from "jsonwebtoken";


const SECRET = process.env.JWT_KEY || 'jwtsecret';
const DEFAULT_OPTIONS = {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    },
    cors: {
        origin: '*',
    }
};

function isAdmin(socket, callback) {
    const { auth } = socket.handshake;
    if (auth && auth.token) {
        try {
            const decoded = jwt.verify(auth.token, SECRET);
            if (decoded.isAdmin) callback();
            else {
                socket.emit('error', { msg: UnauthorizedError('Invalid token') });
            }
        } catch (error) {
            socket.emit('error', UnauthorizedError('Token verification failed'));
        }
    }
}

function emitError(socket, error, callback = () => { }) {
    socket.emit('error', { msg: error });
    callback();
}

export default class SocketManager {
    constructor(httpServer, opts = DEFAULT_OPTIONS) {
        if (!SocketManager.instance) {
            SocketManager.instance = this;
            this.io = new Server(httpServer, opts);
            this.initListeners();
            this.connections = 0;
            this.nodes = {};
        }

        return SocketManager.instance;
    }

    initListeners() {
        this.io.on('connection', (socket) => {
            this.connections += 1;

            socket.on('admin_register', (data) => {
                const { token } = data;
                if (!token) {
                    socket.emit('error', { msg: InvalidRequestError() });
                    return;
                }

                isAdmin(socket, () => {
                    socket.join('admin');
                    socket.emit('admin_nodes_init', {
                        nodes: this.nodes,
                    });
                })
            });

            socket.on('node_register', (data) => {
                const { id, name } = data;
                if (!id || !name) {
                    emitError(socket, InvalidRequestError('Invalid registration data'));
                    return;
                }

                if (this.nodes[id]) {
                    if (this.nodes[id].connected) {
                        emitError(socket, InvalidRequestError('Device is already connected'));
                        return;
                    }

                    this.nodes[id].socket = socket;
                    this.nodes[id].connected = true;
                    this.nodes[id].connectedSince = new Date();
                    this.io.to('admin').emit('admin_nodes_connect', { node: this.nodes[id] });
                } else {
                    this.nodes[id] = {
                        id: id,
                        name: name,
                        socket: socket,
                        connected: true,
                        connectedSince: new Date()
                    }
                    this.io.to('admin').emit('admin_nodes_register', { node: this.nodes[id] });
                }
            });

            socket.on('node_data', (data) => {

            });

            socket.on('node_remove', (data) => {
                const { token, id } = data;
                if (!token || !id) {
                    emitError(socket, InvalidRequestError());
                    return;
                }

                isAdmin(socket, () => {
                    if (!this.nodes[id]) {
                        emitError(socket, InvalidRequestError('Node not found'));
                        return;
                    }

                    const removed = this.nodes[id];
                    if (removed.socket) {
                        removed.socket.emit('disconnect', { msg: 'Disconnected: Removed by administrator' });
                        removed.socket.disconnect(true);
                    }
                    this.io.to('admin').emit('admin_nodes_remove', { node: this.nodes[id] });
                    delete this.nodes[id];
                });
            });

            socket.on('disconnect', (reason) => {
                this.connections -= 1;

                const disconnectNode = Object.values(this.nodes).find(node => node.socket === socket);
                if (disconnectNode) {
                    disconnectNode.connected = false;
                    disconnectNode.socket = null;
                    this.io.to('admin').emit('admin_nodes_disconnect', { node: disconnectNode });
                }
            });
        });
    }
}