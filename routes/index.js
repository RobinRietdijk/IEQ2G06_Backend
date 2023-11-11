import gpt from './gpt/index.js';
import express from 'express';

const home = express.Router();
home.use((req, res, next) => {
    next();
});
home.get('/', (req, res) => {
    res.send({ "status": "OK" });
});

export default {
    home,
    gpt,
}