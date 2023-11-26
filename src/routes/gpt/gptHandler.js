import ChatGPT from '../../lib/ChatGPT.js';
import SocketController from '../../lib/socketio/SocketController.js';
let api = undefined
api = new ChatGPT();

const gptHandler = {
    POST: async (req, res) => {
        const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const result = await api.sendMessage(id, req.body.message);
        res.status(200).json(result);
    }
};

export default gptHandler;