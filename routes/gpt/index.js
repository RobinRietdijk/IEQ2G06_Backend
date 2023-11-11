import express from 'express';
import ChatGPT from '../../lib/ChatGPT.js';
const router = express.Router();
const api = new ChatGPT(router.apply.get('socket'));

router.use((req, res, next) => {
    next();
});

router.get('/', async (req, res) => {
    res.send(await api.sendMessage("Hello GPT"));
});

router.post('/', async (req, res) => {
    res.send(await api.sendMessage(req.body.message));
});

export default router;