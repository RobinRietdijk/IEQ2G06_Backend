import SystemController from "../../../lib/oracle/SystemController.js";
import SocketController from "../../../lib/socketio/SocketController.js";
import { EVENTS, ROOMS } from "../../../util/constants.js";

const systemController = new SystemController();
const socketController = new SocketController();

const systemHandler = {
    POST: (req, res) => {
        const { system_id, system_name, max_nodes } = req.body;
        const system = systemController.createSystem(system_id, system_name, max_nodes);
        socketController.emitTo(ROOMS.SPECTATOR, EVENTS.SYSTEM_CREATED, { system: system });
        res.status(200).send({ system: system });
    },

    DELETE: (req, res) => {
        const system_id = req.params.system_id;
        const system = systemController.removeSystem(system_id);
        socketController.emitTo(ROOMS.SPECTATOR, EVENTS.SYSTEM_REMOVED, { system: system });
        res.status(200).send({ system: system });
    },

    PATCH: (req, res) => {
        const { system_id, system_name, max_nodes } = req.body;
        const system = systemController.updateSystem(system_id, system_name, max_nodes);
        socketController.emitTo(ROOMS.SPECTATOR, EVENTS.SYSTEM_UPDATED, { system: system });
        res.status(200).send({ system: system });
    }
};

export default systemHandler;