import express from 'express';
import ChatGPT from '../../lib/ChatGPT.js';
export default (socket) => {
    const router = express.Router();
    const api = new ChatGPT(socket);

    router.use((req, res, next) => {
        next();
    });

    router.get('/', async (req, res) => {
        res.send(await api.sendMessage("Hello GPT"));
    });

    router.post('/', async (req, res) => {
        res.send(await api.sendMessage(req.body.message));
    });
    
    return router;
}