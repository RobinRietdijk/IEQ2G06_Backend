import express from 'express';
import cors from 'cors';
import SocketManager from './lib/SocketManager.js';
import routes from './routes/index.js';
import logger from './util/logger.js'
import { createServer } from 'http';
const PORT = process.env.PORT || 3001;

const app = express();
const httpServer = createServer(app);
const io = new SocketManager(httpServer);
app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.use(routes.home());
app.use('/gpt', routes.gpt(io.io));
app.use('/login', routes.login());

app.set('socket', io.io);
httpServer.listen(PORT, () => {
    logger.info(`Listening on port: ${PORT}`)
});