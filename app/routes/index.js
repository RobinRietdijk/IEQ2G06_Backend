import gpt from './gpt/index.js';
import express from 'express';

const home = () => {
    const router = express.Router();
    router.use((req, res, next) => {
        next();
    });
    router.get('/', (req, res) => {
        res.send({ "status": "OK" });
    });

    return router;
}

export default {
    home,
    gpt,
}