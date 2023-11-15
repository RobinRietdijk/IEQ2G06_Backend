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

    async sendMessage(id, msg) {
        this.socket.emit('gptquestion', {id: id, msg: msg});
        const res = await this.api.sendMessage(msg, {
            onProgress: (pRes) => pRes.delta ? this.socket.emit('gptanswer_progress', {id: id, msg: pRes}) : null,
            timeoutMs: 1 * 60 * 1000
        });
        res.id = id;
        this.socket.emit('gptanswer', {id: id, msg: msg});
        return res;
    }
}