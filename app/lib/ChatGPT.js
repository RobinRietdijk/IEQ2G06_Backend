import { ChatGPTAPI } from 'chatgpt';
import stream from 'stream';

export default class ChatGPT {
    constructor(socket) {
        this.connected = false;
        this.socket = socket;
        this.init();
    }

    async init() {
        if (process.env.gptAPIKey) {
                this.api = new ChatGPTAPI({
                apiKey: process.env.GPTAPIKEY
            });
            this.connected = true;
        } else {
            this.connected = false;
        }
    }

    async sendMessage(msg) {
        if (!this.connected) throw new Error('ChatGPT not connected!');
        const res = await this.api.sendMessage(msg, {
            onProgress: (pRes) => pRes.delta ? this.socket.emit('data', pRes.delta) : null
        });
        return res.text;
    }
}