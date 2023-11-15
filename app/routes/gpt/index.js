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
            res.send({ "status": "OK" });
        } catch (error) {
            console.error(error.message);
        }
    });

    router.post('/', async (req, res) => {
        try {
            const id = Date.now().toString(36) = Math.random().toString(36).substring(2);
            res.send(await api.sendMessage(id, req.body.message));
        } catch (error) {
            console.error(error.message);
        }
    });
    
    return router;
}