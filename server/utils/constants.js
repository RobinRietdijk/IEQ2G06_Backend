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
    SYSTEM_STATE: 'system_state',
    CONCLUDE: 'conclude',
    ERROR: 'error',
}

export const ROOMS = {
    SPECTATOR: 'spectator'
}

export const STATES = {
    IDLE: 'idle',
    ACTIVE: 'active',
    PROMPTING: 'prompting',
    FIN_PROMPTING: 'finished_prompting'
}