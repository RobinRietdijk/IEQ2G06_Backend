import mqtt from 'mqtt';
import { appLogger as logger } from '../utils/logger';

export default class MQTTController {
    static #instance
    #shiftr_client

    constructor() {
        if (!MQTTController.#instance) MQTTController.#instance = this;
        return MQTTController.#instance;
    }

    init() {
        if (this.#shiftr_client) throw new Error('MQTTController has already been initialized');
        const token = process.env.SHIFTRTOKEN || 'mqtt://ide-education:Sy0L85iwSSgc1P7E@ide-education.cloud.shiftr.io';
        try {
            this.#shiftr_client = mqtt.connect(token, {
                clientId: "DELPHI-server"
            });

            this.#shiftr_client.on('connect', () => {
            });
        } catch (error) {
            logger.warn("MQTT not connected:", error.message);
        }
    }
}