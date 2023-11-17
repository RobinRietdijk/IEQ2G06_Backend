import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import SocketManager from './socket.js';
import routes from './routes/index.js';
import Socket from './socket.js';
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
app.set('socket', io.io);

httpServer.listen(PORT, () => {
    console.debug(`Listening on port: ${PORT}`)
});