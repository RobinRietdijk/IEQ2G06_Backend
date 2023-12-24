import aedes from 'aedes';
import http from 'http';
import ws from 'websocket-stream';
import net from 'net';
import { appLogger as logger } from "../utils/logger";

export default class MQTTBroker {
    static #instance;

    constructor() {
        if (!MQTTBroker.#instance) {
            MQTTBroker.#instance = this;
            this.aedes = aedes();
            this.initMQTTBroker();
        }
        return MQTTBroker.#instance;
    }

    initMQTTBroker(httpServer) {
        const mqttPort = 1883;
        const wsPort = httpServer.address().port;

        const mqttServer = net.createServer(this.aedes.handle);
        mqttServer.listen(mqttPort, () => {
            console.log(`MQTT Broker running on port ${mqttPort}`);
        });

        ws.createServer({ server: httpServer }, this.aedes.handle)

        this.#initListeners();
    }

    #initListeners() {
        this.aedes.on('client', (client) => {
            console.log(`Client Connected: ${client.id}`);
        });

        this.aedes.on('clientDisconnect', (client) => {
            console.log(`Client Disconnected: ${client.id}`);
        });

        this.aedes.on('publish', (packet, client) => {
            if (client) {
                console.log(`Message from ${client.id}:`, packet.payload.toString());
            }
        });
    }
}