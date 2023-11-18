export default class Node {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        
        this.socket = undefined;
        this.connected = false;
        this.connectedSince = undefined;
    }

    isConnected() {
        return this.connected;
    }

    connect(socket) {
        this.socket = socket;
        this.connected = true;
        this.connectedSince = new Date();
        this.socket.node_id = this.id;
    }

    disconnect() {
        this.socket = undefined;
        this.connected = false;
        this.connectedSince = new Date();
    }
}