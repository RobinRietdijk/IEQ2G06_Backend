import Node from './Node.js'
import { EVENTS } from '../../util/constants.js';

export default class System {
    constructor(id, name, max_nodes = -1) {
        this.id = id;
        this.name = name;
        this.max_nodes = max_nodes;

        this.limit = max_nodes !== -1;
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

    addNode(node, root) {
        if (root && this.root) throw new Error(`System: "${this.id}" already has a root`);
        if (root) this.root = node;
        this.nodes[node.id] = node;
    }

    removeNode(id) {
        if (!this.nodes[id]) throw new Error(`Node: "${id}" does not exist`);
        if (this.root === id) this.root = undefined;
        delete this.nodes[id];
    }
}