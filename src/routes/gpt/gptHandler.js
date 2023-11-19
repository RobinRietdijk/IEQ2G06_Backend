import ChatGPT from '../../lib/ChatGPT.js';
import SocketManager from '../../lib/socket/SocketManager.js';
let api = undefined
const sm = new SocketManager();
api = new ChatGPT(sm.io);

const gptHandler = {
    POST: async (req, res) => {
        const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const result = await api.sendMessage(id, req.body.message);
        res.status(200).json(result);
    }
};

export default gptHandler;