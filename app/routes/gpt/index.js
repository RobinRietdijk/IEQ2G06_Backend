import express from 'express';
import ChatGPT from '../../lib/ChatGPT.js';
export default (socket) => {
    const router = express.Router();
    const api = new ChatGPT(socket);

    router.use((req, res, next) => {
        next();
    });

    router.get('/', async (req, res) => {
        try {
            res.send(await api.sendMessage("Hello GPT"));
        } catch (error) {
            console.error(error.message);
        }
    });

    router.post('/', async (req, res) => {
        try {
            res.send(await api.sendMessage(req.body.message));
        } catch (error) {
            console.error(error.message);
        }
    });
    
    return router;
}