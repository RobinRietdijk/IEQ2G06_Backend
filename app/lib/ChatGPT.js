import { ChatGPTAPI } from 'chatgpt';
import stream from 'stream';

export default class ChatGPT {
    constructor(socket) {
        this.connected = false;
        this.socket = socket;
        this.init();
    }

    async init() {
        this.api = new ChatGPTAPI({
            apiKey: process.env.GPTAPIKEY
        });
    }

    async sendMessage(msg) {
        this.socket.emit('start_generation', {});
        const res = await this.api.sendMessage(msg, {
            onProgress: (pRes) => pRes.delta ? this.socket.emit('progress', pRes.delta) : null
        });
        this.socket.emit('end_generation', {});
        return res.text;
    }
}