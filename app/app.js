import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routes from './routes/index.js';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(routes.home());
app.use('/gpt', routes.gpt(io));

io.on('connection', (socket) => {
    console.debug("Socket connected!");
    socket.on('disconnect', (reason) => {
        console.debug(`Socket disconnected, reason: ${reason}`);
    })
});
app.set('socket', io);

httpServer.listen(PORT, () => {
    console.debug(`Listening on port: ${PORT}`)
});