import { appLogger as logger } from './logger.js';

export default class ChatGPT {
    #connected
    constructor() {
        this.#connected = false;
        this.init();
    }

    async init() {
        try {
            if (!process.env.GPTAPIKEY) {
                throw new Error("Unable to connect ChatGPT, no OpenAI API key provided")
            }

            const { ChatGPTAPI } = await import('chatgpt');
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

    isConnected() {
        return this.#connected;
    }

    async sendMessage(msg) {
        if (!this.connected) {
            throw new Error("Unable to connect to ChatGPT, API not connected");
        }

        const res = await this.api.sendMessage(msg, {
            timeoutMs: 1 * 60 * 1000
        });

        return res;
    }
}