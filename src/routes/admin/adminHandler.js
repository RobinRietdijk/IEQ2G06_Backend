import nodeHandler from './node/nodeHandler.js';
import systemHandler from './system/systemHandler.js';

const adminHandler = {
    GET: (req, res) => {
    },

    NODE: nodeHandler,
    SYSTEM: systemHandler,
};

export default adminHandler;