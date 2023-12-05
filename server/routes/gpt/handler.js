import ChatGPT from "./ChatGPT";
const api = new ChatGPT();

const gptHandler = {
    GET: (req, res) => {
        const connected = api.isConnected()
        res.status(200).json({ 'status': connected });
    },
    POST: async (req, res) => {
        const result = await api.sendMessage(req.body.message);
        res.status(200).json(result);
    }
};

export default gptHandler;