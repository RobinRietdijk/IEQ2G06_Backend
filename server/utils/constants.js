export const NODE_ENV = process.env.NODE_ENV;
export const UPS = process.env.UPS || '20';

export const ROUTES = {
    INDEX: '/',
    FORMAT: '/format',
}

export const EVENTS = {
    CONNECT: 'connect',
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    INITIALIZE: 'initialize',
    NODE_INIT: 'node_init',
    NODE_CONNECT: 'node_connect',
    NODE_CONNECTED: 'node_connected',
    NODE_DISCONNECT: 'node_disconnect',
    NODE_DISCONNECTED: 'node_disconnected',
    NODE_REMOVED: 'node_removed',
    NODE_DATA: 'node_data',
    SYSTEM_CREATED: 'system_created',
    SYSTEM_REMOVED: 'system_removed',
    SYSTEM_UPDATED: 'system_updated',
    SYSTEM_DATA: 'system_data',
    SYSTEMS_DATA: 'systems_data',
    ERROR: 'error',
    PING: 'ping',
    PONG: 'pong'
}

export const ROOMS = {
    SPECTATOR: 'spectator'
}