export const NODE_ENV = process.env.NODE_ENV;
export const UPS = process.env.UPS || '10';

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
    ERROR: 'error',
}

export const ROOMS = {
    SPECTATOR: 'spectator'
}