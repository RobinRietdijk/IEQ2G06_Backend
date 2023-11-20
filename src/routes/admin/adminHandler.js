import SystemController from '../../lib/oracle/SystemController.js';
import nodeHandler from './node/nodeHandler.js';
import systemHandler from './system/systemHandler.js';

const systemController = new SystemController();

const adminHandler = {
    NODE: nodeHandler,
    SYSTEM: systemHandler,
    GET: (req, res) => {
        const systems = systemController.getSystems();
        const nodes = systemController.getNodes();
        res.status(200).json({ nodes: nodes, systems: systems });
    },
};

export default adminHandler;