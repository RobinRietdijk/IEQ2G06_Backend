import Node from "./Node.js";
import System from "./System.js";
import { appLogger as logger } from "../../util/logger.js";
export default class SystemController {
    static #instance;
    constructor() {
        if (!SystemController.#instance) {
            SystemController.#instance = this;
            this.systems = {};
            this.nodes = {};
        }

        return SystemController.#instance;
    }

    #executeWithStateBackup(f) {
        const backup = { nodes: { ...this.nodes }, systems: { ...this.systems } };
        try {
            const res = f();

            this.nodes = { ...this.nodes };
            this.systems = { ...this.systems };

            return res;
        } catch (error) {
            logger.error('An error occured in the Systemcontroller: ', error.message);
            this.nodes = backup.nodes;
            this.systems = backup.systems;
            throw error;
        }
    }

    #removeNode(node_id) {
        const node = this.nodes[node_id];
        if (!node) throw new Error(`Node: "${node_id}" does not exist`);

        this.systems[node.system_id].removeNode(node_id);
        delete this.nodes[node_id];

        return node;
    }

    getNode(node_id) {
        const node = this.nodes[node_id];
        if (!node) throw new Error(`Node: "${node_id}" does not exist`);
        return node;
    }

    getNodes() {
        return this.nodes;
    }

    getSystem(system_id) {
        const system = this.systems[system_id];
        if (!system) throw new Error(`System: "${system_id}" does not exist`);
        return system;
    }

    getSystems() {
        return this.systems;
    }

    hasSystem(system_id) {
        try {
            this.getSystem(system_id);
            return true;
        } catch (error) {
            return false;
        }
    }

    addSystem(system_id) {
        if (!this.systems[system_id]) throw new Error(`System: "${system_id}" already exists`);
        const system = new System(system_id);
        this.systems[system_id] = system;
        return system;
    }

    removeSystem(system_id) {
        const system = this.systems[system_id];
        if (!system) throw new Error(`System: "${system_id}" does not exist`);
        delete this.systems[system_id];
        return system;
    }

    connectNode(socket, node_id, node_name, system_id, root) {
        return this.#executeWithStateBackup(() => {
            if (this.nodes[node_id]) throw new Error(`Node: "${node_id}" already exists`);
            const node = new Node(node_id, node_name, system_id, root, socket);
            this.nodes[node_id] = node;

            const system = this.systems[system_id];
            system.addNode(node);

            return node;
        });
    }

    disconnectNode(node_id) {
        return this.#executeWithStateBackup(() => {
            return this.#removeNode(node_id);
        });
    }
}