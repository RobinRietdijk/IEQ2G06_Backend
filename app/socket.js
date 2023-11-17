import { Server } from "socket.io"

function isTokenInUse(token) {
    return token;
}

export default (httpServer) => {
    const connections = [];
    const controllers = {};
    const io = new Server(httpServer, {
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true,
        },  
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket) => {
        if (socket.recovered) {
            console.log(`Socket connection recovered`);
        } else {
            console.log(`New socket connected`)
        }
        socket.on('disconnect', (reason) => {
            console.debug(`Socket disconnected, reason: ${reason}`);
        })
    });

    return io;
}