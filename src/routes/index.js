import express from 'express';
import { ROUTES } from '../util/constants.js';
import { appLogger as logger } from '../util/logger.js';
import indexHandler from './indexHandler.js';
import gptHandler from './gpt/gptHandler.js';
const router = express.Router();

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
}

router.route(ROUTES.INDEX)
    .get(indexHandler.GET);

router.route(ROUTES.GPT)
    .post(gptHandler.POST);

router.use(errorHandler);
export default router;