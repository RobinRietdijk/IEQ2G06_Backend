import { ChatGPTAPI } from 'chatgpt';
import { appLogger as logger } from '../util/logger.js';

export default class ChatGPT {
    constructor(socketio) {
        this.connected = false;
        this.socketio = socketio;
        this.init();
    }

    async init() {
        try {
            if (!process.env.GPTAPIKEY) {
                throw new Error("Unable to connect ChatGPT, no OpenAI API key provided")
            }

            this.api = new ChatGPTAPI({
                apiKey: process.env.GPTAPIKEY
            });

            this.connected = true;
            logger.info("ChatGPT API successfully connected")
        } catch (error) {
            this.api = undefined;
            logger.error(error.message);
        }
    }

    async sendMessage(id, msg) {
        if (!this.connected) {
            throw new Error("Unable to connect to ChatGPT, API not connected");
        }

        this.socket.emit('gptquestion', { id: id, msg: msg });
        const res = await this.api.sendMessage(msg, {
            onProgress: (pRes) => pRes.delta ? this.socket.emit('gptanswer_progress', { id: id, msg: pRes }) : null,
            timeoutMs: 1 * 60 * 1000
        });

        res.id = id;
        this.socket.emit('gptanswer', { id: id, msg: msg });
        
        return res;
    }
}