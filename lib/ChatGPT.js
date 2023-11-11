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
            apiKey: process.env.apiKey || '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'
        });
        this.connected = true;
    }

    async sendMessage(msg) {
        if (!this.connected) throw new Error('ChatGPT not connected!');
        const res = await this.api.sendMessage(msg, {
            onProgress: (pRes) => pRes.delta ? this.socket.emit('data', pRes.delta) : null
        });
        return res.text;
    }
}