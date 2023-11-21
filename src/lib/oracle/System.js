import Node from './Node.js'
import { EVENTS } from '../../util/constants.js';

export default class System {
    constructor(id, name, max_nodes = -1) {
        this.id = id;
        this.name = name;
        this.max_nodes = max_nodes;

        this.limit = max_nodes >= 0;
        this.nodes = {};
        this.root = undefined;
    }

    size() {
        return Object.keys(this.nodes).length;
    }

    setName(name) {
        this.name = name;
    }

    setMaxNodes(max_nodes) {
        if (max_nodes >= 0 && this.size() > max_nodes) throw new Error(`System: "${this.id}" cannot set max nodes lower than current nodes in system`);
        this.limit = max_nodes >= 0;
        this.max_nodes = max_nodes;
    }

    setRoot(node) {
        if (this.root) throw new Error(`System: "${this.id}" already has a root`);
        this.root = node;
    }

    getRoot() {
        if (!this.root) throw new Error(`System: "${this.id}" does not have a root`);
        return this.root;
    }

    hasRoot() {
        return Boolean(this.root)
    }

    getNode(node_id) {
        const node = this.nodes[node_id]
        if (!node) throw new Error(`Node: "${node_id}" does not exist in this system`);

        return node;
    }

    addNode(node) {
        if (this.limit && this.max_nodes <= this.size()) throw new Error(`System: "${this.id}" is at max nodes`);
        if (node.isRoot()) this.setRoot(node);
        this.nodes[node.id] = node;

        return node;
    }

    removeNode(node_id) {
        const node = this.nodes[node_id]
        if (!node) throw new Error(`Node: "${node_id}" does not exist`);
        if (node.isRoot()) this.root = undefined;
        delete this.nodes[id];

        return node;
    }

    createDataPackage() {
        const data_package = []
        for (const node of Object.values(this.nodes)) {
            if (!node.isRoot()) data_package.push(node.getData());
        }
        return data_package;
    }
}