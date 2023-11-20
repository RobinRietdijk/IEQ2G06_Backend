import SystemController from "../../../lib/oracle/SystemController";
import SocketController from "../../../lib/socketio/SocketController";
import { EVENTS, ROOMS } from "../../../util/constants";

const systemController = new SystemController();
const socketController = new SocketController();

const nodeHandler = {
    DELETE: (req, res) => {
        const { node_id } = req.body;
        const node = systemController.removeNode(node_id);
        socketController.emitTo(ROOMS.ADMIN, EVENTS.NODE_REMOVED, { node: node });
        res.status(200).send();
    },
};

export default nodeHandler;