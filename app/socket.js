import { Server } from "socket.io"

const DEFAULT_OPTIONS = {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    },  
    cors: {
        origin: '*',
    }
};

class SocketManager {
    constructor(httpServer, opts=DEFAULT_OPTIONS) {
        if (!SocketManager.instance) {
            SocketManager.instance = this;
            this.io = new Server(httpServer, opts);
            this.initListeners()
        }

        return SocketManager.instance;
    }

    initListeners() {
        this.io.on('connection', (socket) => {
            if (socket.recovered) {
                console.log(`Socket connection recovered`);
            } else {
                console.log(`New socket connected`)
            }
            socket.on('disconnect', (reason) => {
                console.debug(`Socket disconnected, reason: ${reason}`);
            })
        });
    }
}

export default SocketManager;