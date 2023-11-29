export default class System {
    constructor(id) {
        this.id = id;
        this.nodes = {};
        this.root = undefined;
    }

    size() {
        return Object.keys(this.nodes).length;
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
        delete this.nodes[node_id];

        return node;
    }

    createDataPackage() {
        const data_package = {}
        let changed = false;
        for (const node of Object.values(this.nodes)) {
            if (!node.isRoot()) {
                if (node.hasChanged()) changed = true;
                data_package[node.id] = node.getData();
            }
        }
        return { changed: changed, data_package: data_package };
    }
}