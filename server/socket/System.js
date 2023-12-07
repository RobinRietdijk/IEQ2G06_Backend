import { EVENTS } from "../utils/constants";
import Node from "./Node";

export default class System {
    #io
    #system_id
    #nodes
    #last_update
    #idle

    constructor(io, system_id) {
        this.#io = io
        this.#system_id = system_id;
        this.#nodes = {};
        this.#last_update = new Date(0).getTime();
        this.#idle = true;
    }

    size() {
        return Object.keys(this.#nodes).length;
    }

    emit(event, data=null) {
        this.#io.to(this.#system_id).emit(event, data);
    }

    getSystemId() {
        return this.#system_id;
    }

    getNode(socket_id) {
        return this.#nodes[socket_id];
    }

    getNodes() {
        return this.#nodes;
    }

    createNode(socket_id, node_id) {
        this.#nodes[socket_id] = new Node(node_id);
        return this.#nodes[socket_id];
    }

    connectNode(socket, node_data) {
        const node = this.getNode(socket.id);
        node.connect(socket);
        node.setData(node_data);
        socket.join(this.#system_id);
    }

    updateNodeData(socket, node_data) {
        this.#last_update = new Date().getTime();
        if (this.#idle) {
            this.#idle = false;
            this.emit(EVENTS.SYSTEM_ACTIVE);
        }
        this.#nodes[socket.id].setData(node_data);
    }

    dataLoop() {
        const systemPackage = {};
        let changed = false;
        for (const node in Object.values(this.#nodes)) {
            if (node.isConnected()) {
                if (node.hasChanged()) changed = true;
                systemPackage[node.getId()] = node.getData();
            }
        }

        if (changed) this.emit(EVENTS.SYSTEM_DATA, { system_data: systemPackage });
    }
    
    idleLoop(timeout) {
        if (!this.#idle) {
            const now = new Date().getTime();
            if (!this.#idle && now - this.#last_update > timeout) {
                this.#idle = true;
                this.#io.emit(EVENTS.SYSTEM_IDLE);
            }
        }
    }

    cleanupLoop(timeout) {
        const now = new Date().getTime();
        for (const [key, node] in Object.entries(this.#nodes)) {
            if (!node.isConnected() && now - node.getDisconnectedSince() > timeout) delete this.#nodes[key];
        }
    }
}