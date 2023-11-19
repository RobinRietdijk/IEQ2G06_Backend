import nodeHandler from './node/nodeHandler.js';
import systemHandler from './system/systemHandler.js';

const adminHandler = {
    NODE: nodeHandler,
    SYSTEM: systemHandler,
    GET: (req, res) => {
        
    },
};

export default adminHandler;