import SystemController from "../../../lib/oracle/SystemController.js";
import SocketController from "../../../lib/socketio/SocketController.js";
import { EVENTS, ROOMS } from "../../../util/constants.js";

const systemController = new SystemController();
const socketController = new SocketController();

const nodeHandler = {
    DELETE: (req, res) => {
        const node_id = req.params.node_id;
        const node = systemController.removeNode(node_id);
        socketController.emitTo(ROOMS.SPECTATOR, EVENTS.NODE_REMOVED, { node: node });
        res.status(200).send();
    },
};

export default nodeHandler;