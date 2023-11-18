import express from 'express';
import ChatGPT from '../../lib/ChatGPT.js';
import { appLogger as logger } from '../../util/logger.js';
export default (socket) => {
    const router = express.Router();
    let api = undefined
    api = new ChatGPT(socket);

    router.use((req, res, next) => {
        next();
    });

    router.get('/', async (req, res) => {
        try {
            res.status(200).json({ status: "OK" });
        } catch (error) {
            logger.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
            if (api) {
                const result = await api.sendMessage(id, req.body.message);
            } else {
                throw new Error('ChatGPT API not connected');
            }
            res.status(200).json(result);
        } catch (error) {
            logger.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    });
    
    return router;
}