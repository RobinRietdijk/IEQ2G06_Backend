import bcrypt from 'bcrypt';

export const SECRET = process.env.JWT_KEY || 'jwt_secret'; 
export const REFRESH_SECRET = process.env.JWT_REFRESH_KEY || 'jwt_refresh_secret'; 
export const ADMIN_USER = process.env.ADMIN_USER || 'admin';
export const ADMIN_PASSWD = process.env.ADMIN_PASSWD || bcrypt.hashSync('admin', 10);

export const SYSTEM_FILENAME = process.env.SYSTEM_FILENAME || 'systems.json'

export const ROUTES = {
    INDEX: '/',
    LOGIN: '/login',
    GPT: '/gpt',
    ADMIN: '/admin',
    NODES: '/nodes',
    NODE: '/node',
    SYSTEMS: '/systems',
    SYSTEM: '/system',
    REFRESH: '/refresh',
}

export const EVENTS = {
    CONNECT: 'connect',
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    INITIALIZE: 'initialize',
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