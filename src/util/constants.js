import bcrypt from 'bcrypt';

export const SECRET = process.env.JWT_KEY || 'jwtsecret'; 
export const ADMIN_USER = process.env.ADMIN_USER || 'admin';
export const ADMIN_PASSWD = process.env.ADMIN_PASSWD || bcrypt.hashSync('admin', 10);

export const ROUTES = {
    INDEX: '/',
    LOGIN: '/login',
    GPT: '/gpt',
    ADMIN: '/admin',
    NODES: '/nodes',
    NODE: '/node',
    SYSTEMS: '/systems',
    SYSTEM: '/system',
}

export const EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    NODE_CONNECT: 'node_connect',
    NODE_CONNECTED: 'node_connected',
    NODE_DISCONNECT: 'node_disconnect',
    NODE_DISCONNECTED: 'node_disconnected',
    NODE_CREATED: 'node_created',
    NODE_REMOVE: 'node_remove',
    NODE_REMOVED: 'node_removed',
    NODE_UPDATE: 'node_update',
    NODE_UPDATED: 'node_updated',
    NODE_DATA: 'node_data',
    ROOT_PACKAGE: 'root_package',
    SYSTEM_CREATE: 'system_create',
    SYSTEM_CREATED: 'system_created',
    SYSTEM_REMOVE: 'system_remove',
    SYSTEM_REMOVED: 'system_removed',
    SYSTEM_UPDATE: 'system_update',
    SYSTEM_UPDATED: 'system_updated',
    ADMIN_CONNECT: 'admin_connect',
    ADMIN_INIT: 'admin_init',
    ERROR: 'error',
    PING: 'ping',
    PONG: 'pong'
}

export const ROOMS = {
    ADMIN: 'admin'
}