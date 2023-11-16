import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import socketio from './socket.js';
import routes from './routes/index.js';
const PORT = process.env.PORT || 3001;

const app = express();
const httpServer = createServer(app);
const io = socketio(httpServer)

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(routes.home());
app.use('/gpt', routes.gpt(io));
app.set('socket', io);

httpServer.listen(PORT, () => {
    console.debug(`Listening on port: ${PORT}`)
});