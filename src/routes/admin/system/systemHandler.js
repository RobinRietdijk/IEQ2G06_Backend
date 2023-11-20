import SystemController from "../../../lib/oracle/SystemController";
import SocketController from "../../../lib/socketio/SocketController";
import { EVENTS, ROOMS } from "../../../util/constants";

const systemController = new SystemController();
const socketController = new SocketController();

const systemHandler = {
    POST: (req, res) => {
        const { system_id, system_name, max_nodes } = req.body;
        const system = systemController.createSystem(system_id, system_name, max_nodes);
        socketController.emitTo(ROOMS.ADMIN, EVENTS.SYSTEM_CREATED, { system: system });
        res.status(200).send();
    },

    DELETE: (req, res) => {
        const { system_id } = req.body;
        const system = systemController.removeSystem(system_id);
        socketController.emitTo(ROOMS.ADMIN, EVENTS.SYSTEM_REMOVED, { system: system });
        res.status(200).send();
    },

    UPDATE: (req, res) => {
        const { system_id, system_name, max_nodes } = req.body;
        const system = systemController.updateSystem(system_id, system_name, max_nodes);
        socketController.emitTo(ROOMS.ADMIN, EVENTS.SYSTEM_UPDATED, { system: system });
        res.status(200).send();
    }
};

export default systemHandler;