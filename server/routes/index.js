import express from 'express';
import { ROUTES } from '../utils/constants';
import { appLogger as logger } from '../utils/logger';
import indexHandler from './handler';
import formatHandler from './format/handler';
import gptHandler from './gpt/handler';
const router = express.Router();

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
}

router.route(ROUTES.INDEX)
    .get(indexHandler.GET);
router.route(ROUTES.FORMAT)
    .get(formatHandler.GET)
    .post(formatHandler.POST);
router.route(ROUTES.GPT)
    .get(gptHandler.GET)
    .post(gptHandler.POST);

router.use(errorHandler);
export default router;
