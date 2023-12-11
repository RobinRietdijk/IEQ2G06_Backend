export const NODE_ENV = process.env.NODE_ENV;
export const UPS = process.env.UPS || '1';
export const URL = NODE_ENV == 'development' ? `http://localhost:${process.env.PORT || 3000}` : 'https://oracle-api.rjrietdijk.com'

export const ROUTES = {
    INDEX: '/',
    CARD: '/card',
    GPT: '/gpt'
}

export const EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    NODE_CONNECT: 'node_connect',
    NODE_CONNECTED: 'node_connected',
    NODE_DATA: 'node_data',
    SYSTEM_DATA: 'system_data',
    SYSTEM_STATE: 'system_state',
    SYSTEM_CONCLUDE: 'system_conclude',
    ERROR: 'error',
}

export const ROOMS = {
    SPECTATOR: 'spectator'
}

export const STATES = {
    IDLE: 'idle',
    ACTIVE: 'active',
    PROMPTING: 'prompting',
    PRINTING: 'printing'
}

export const PROMPT = (color) => {
    `Hello, this is a prompt with the color ${color}`
}