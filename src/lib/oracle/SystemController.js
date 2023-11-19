import Node from "./Node";
import System from "./System";
import { appLogger as logger } from "../../util/logger";

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
        const backup = { nodes: { ...this.nodes }, systems: { ...this.systems }};
        try {
            const res = f();

            this.nodes = { ...this.nodes };
            this.systems = { ...this.systems };

            return res;
        } catch (error) {
            logger.error('An error occured in the Systemcontroller: ', error);
            this.nodes = backup.nodes;
            this.systems = backup.systems;
            throw error;
        }
    }

    #createNode(node_id, node_name, system_id, root) {
        if (this.nodes[node_id]) throw new Error(`Node: "${node_id} already exists"`);
        const system = this.systems[system_id];
        if (!system) throw new Error(`System: "${system_id}" does not exist`);

        const node = new Node(node_id, node_name, system_id, root);
        system.addNode(node);
        this.nodes[node_id] = node;

        return node;
    }

    addSystem(system_id = null, system_name, max_nodes = -1) {
        return this.#executeWithStateBackup(() => {
            if (!system_id) {
                let index = 1;
                system_id = system_name.replace(/\s+/g, '-').toLowerCase();
                while (this.systems[system_id + `-${index}`]) index++;
                system_id += `-${index}`;
            }
            if (this.systems[system_id]) throw new Error(`System: "${system_id}" already exists`)

            const system = new System(system_id, system_name, max_nodes);
            this.systems[system_id] = system;

            return system;
        });
    }

    removeSystem(system_id) {
        return this.#executeWithStateBackup(() => {
            const system = this.systems[system_id];
            if (!system) throw new Error(`System: "${system_id}" does not exist`);
            system.nodes.forEach(node => {
                node.forceDisconnect(`System: "${system_id}" has been removed`);
            });
            delete this.systems[system_id];

            return system;
        });
    }

    updateSystem(system_id, name = null, max_nodes = null) {
        return this.#executeWithStateBackup(() => {
            const system = this.systems[system_id];
            if (!system) throw new Error(`System: "${system_id}" does not exist`);

            if (name) system.setName(name);
            if (max_nodes) system.setMaxNodes(max_nodes);

            return system;
        });
    }

    removeNode(node_id) {
        return this.#executeWithStateBackup(() => {
            const node = this.nodes[node_id];
            if (!node) throw new Error(`Node: "${node_id}" does not exist`);

            const system = this.systems[node.system_id];
            if (system) system.removeNode(node_id);

            node.forceDisconnect();
            delete this.nodes[node_id];

            return node;
        });
    }

    connectNode(node_id, node_name, system_id, socket, root) {
        return this.#executeWithStateBackup(() => {
            let node = this.nodes[node_id];
            if (!node) node = this.#createNode(node_id, node_name, system_id, root);
            else {
                if (node.name !== node_name) node.setName(node_name);
                if (node.system_id !== system_id) {
                    const oldSystem = this.systems[node.system_id];
                    const newSystem = this.systems[system_id];

                    if (!oldSystem) throw new Error(`System: "${node.system_id}" does not exist`);
                    if (!newSystem) throw new Error(`System: "${system_id}" does not exist`);

                    if (node.root !== root) node.setRoot(root);

                    newSystem.addNode(node);
                    oldSystem.removeNode(node);
                    node.setSystem(system_id);
                }
                if (node.root !== root) {
                    node.setRoot(root);
                    const system = this.systems[node.system_id];
                    if (!system) throw new Error(`System: "${node.system_id}" does not exist`);
                    if (root) system.setRoot(node);
                }
            }
            node.connect(socket);

            return node;
        });
    }

    disconnectNode(node_id) {
        return this.#executeWithStateBackup(() =>  {
            const node = this.nodes[node_id];
            if (!node) throw new Error(`Node: "${node_id}" does not exist`);
            node.disconnect();

            return node;
        });
    }
}