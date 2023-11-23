import { ChatGPTAPI } from 'chatgpt';
import { appLogger as logger } from '../util/logger.js';

export default class ChatGPT {
    constructor() {
        this.connected = false;
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

        const res = await this.api.sendMessage(msg, {
            timeoutMs: 1 * 60 * 1000
        });

        res.id = id;
        
        return res;
    }
}