import Node from './Node.js'
import { EVENTS } from '../socket/constants.js';

export default class System {
    constructor(id, name, max_nodes = -1) {
        this.limit = max_nodes !== -1;
        this.id = id;
        this.name = name;
        this.nodes = {};
        this.root = undefined;
    }

    size() {
        return Object.keys(this.nodes).length;
    }

    getNode(id) {
        if (this.nodes[id]) return this.nodes[id];
        throw new Error(`Node: "${id}" does not exist in this system`);
    }

    connectNode(id, name, socket, root) {
        if (!this.nodes[id]) {
            if (root && this.root) throw new Error(`System: "${this.id}" already has a root`);
            this.nodes[id] = new Node(id, name);
            this.nodes[id].connect(socket);
            this.nodes[id].socket.system_id = this.id;
            if (root) this.root = id;
            return EVENTS.NODE_REGISTERED;
        } else {
            if (this.nodes[id].connected) throw new Error(`Node: "${id}" is already connected`);
            this.nodes[id].connect(socket);
            this.nodes[id].socket.system_id = this.id;
            return EVENTS.NODE_CONNECTED;
        }
    }

    disconnectNode(id) {
        if (!this.nodes[id]) throw new Error(`Node: "${id}" does not exist`);
        if (!this.nodes[id].connected) throw new Error(`Node: "${id}" is not connected`);
        this.nodes[id].disconnect();
        return EVENTS.NODE_DISCONNECTED;
    }

    removeNode(id) {
        if (!this.nodes[id]) throw new Error(`Node: "${id}" does not exist`);
        if (this.root === id) this.root = undefined;
        const node = this.nodes[id];
        delete this.nodes[id];
        return { event: EVENTS.NODE_REMOVED, socket: node.socket };
    }
}