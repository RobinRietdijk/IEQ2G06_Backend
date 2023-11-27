import ChatGPT from '../../lib/ChatGPT.js';
import SocketController from '../../lib/socketio/SocketController.js';
let api = undefined
api = new ChatGPT();

const gptHandler = {
    POST: async (req, res) => {
        const result = await api.sendMessage(req.body.message);
        res.status(200).json(result);
    }
};

export default gptHandler;