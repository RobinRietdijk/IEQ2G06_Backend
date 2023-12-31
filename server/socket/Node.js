export default class Node {
    #socket;
    #id;
    #data;
    #changed;
    #connectedSince;
    #disconnectedSince;

    constructor(id) {
        this.#id = id;

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
        this.#connectedSince = new Date().getTime();
        this.#disconnectedSince = null;
    }

    disconnect() {
        this.#socket = null;
        this.#connectedSince = null;
        this.#disconnectedSince = new Date().getTime();
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