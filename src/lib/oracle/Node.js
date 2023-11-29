import { EVENTS } from "../../util/constants.js";

export default class Node {
    #socket;

    constructor(id, name, system_id, root=false, socket) {
        this.id = id;
        this.name = name;
        this.system_id = system_id;
        this.root = root;
        
        this.#socket = socket;
        this.connectedSince = new Date();

        this.data = {};
        this.changed = false;
    }

    isConnected() {
        return this.#socket.connected;
    }

    isRoot() {
        return this.root;
    }

    getName() {
        return this.name
    }

    setName(name) {
        this.name = name;
    }

    getSystem() {
        return this.system_id;
    }

    setSystem(system_id) {
        this.system_id = system_id;
    }

    setRoot(root) {
        this.root = root;
    }

    setData(data) {
        this.changed = true;
        this.data = data;
    }

    getData() {
        this.changed = false;
        return this.data;
    }

    hasChanged() {
        return this.changed;
    }

    emit(event, data) {
        if (!this.connected) throw new Error(`Node: "${this.id} is not connected"`);
        this.#socket.emit(event, data);
    }
}