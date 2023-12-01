export default class Node {
    #socket;
    #id;
    #data;
    #changed;
    #root;
    #connectedSince;
    #disconnectedSince;

    constructor(id, root) {
        this.#id = id;
        this.#root = root;

        this.#data = null;
        this.#changed = false;
        this.#connectedSince = null;
        this.#disconnectedSince = null;
    }

    getSocket() {
        return this.#socket;
    }

    getId() {
        return this.#id;
    }

    isConnected() {
        if (!this.#socket) return false;
        return this.#socket.connected;
    }

    isRoot() {
        return this.#root;
    }

    setData(data) {
        this.#data = data;
        this.#changed = true;
    }

    getData() {
        this.#changed = false;
        return this.#data;
    }

    hasChanged() {
        return this.#changed;
    }
    
    connect(socket) {
        this.#socket = socket;
        this.#connectedSince = new Date();
        this.#disconnectedSince = null;
    }

    disconnect() {
        this.#socket = null;
        this.#connectedSince = null;
        this.#disconnectedSince = new Date();
    }

    getConnectedSince() {
        if (!this.isConnected()) throw new Error("Node is not connected");
        return this.#connectedSince;
    }

    getDisconnectedSince() {
        if (this.isConnected()) throw new Error("Node is still connected");
        return this.#disconnectedSince;
    }
}