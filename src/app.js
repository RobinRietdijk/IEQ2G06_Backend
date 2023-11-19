import express from 'express';
import cors from 'cors';
import SocketManager from './lib/socket/SocketManager.js';
import router from './routes/index.js';
import { appLogger as logger } from './util/logger.js'
import { createServer } from 'http';
import { requestLogger, responseLogger } from './middleware/morgan.js';
const PORT = process.env.PORT || 3001;

const app = express();
const httpServer = createServer(app);
const io = new SocketManager(httpServer);
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(requestLogger);
app.use(responseLogger);

app.use(router);

app.set('socket', io.io);
httpServer.listen(PORT, () => {
    logger.info(`Listening on port: ${PORT}`)
});