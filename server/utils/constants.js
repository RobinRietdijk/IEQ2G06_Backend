export const NODE_ENV = process.env.NODE_ENV;
export const UPS = process.env.UPS || '1';

export const ROUTES = {
    INDEX: '/',
    FORMAT: '/format',
}

export const EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    NODE_CONNECT: 'node_connect',
    NODE_CONNECTED: 'node_connected',
    NODE_DATA: 'node_data',
    SYSTEM_DATA: 'system_data',
    SYSTEM_IDLE: 'system_idle',
    SYSTEM_ACTIVE: 'system_active',
    SYSTEM_PROMPTING: 'system_prompting',
    SYSTEM_FINISHED_PROMPTING: 'system_finished_prompting',
    GPT_PROMPT: 'gpt_prompt',
    GPT_ANSWER: 'gpt_answer',
    PRINT: 'print',
    ERROR: 'error',
}

export const ROOMS = {
    SPECTATOR: 'spectator'
}