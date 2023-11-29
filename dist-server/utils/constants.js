"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPS = exports.ROUTES = exports.ROOMS = exports.EVENTS = void 0;
var UPS = exports.UPS = process.env.UPS || '20';
var ROUTES = exports.ROUTES = {
  INDEX: '/',
  LOGIN: '/login',
  GPT: '/gpt',
  ADMIN: '/admin',
  NODES: '/nodes',
  NODE: '/node',
  SYSTEMS: '/systems',
  SYSTEM: '/system',
  REFRESH: '/refresh'
};
var EVENTS = exports.EVENTS = {
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
};
var ROOMS = exports.ROOMS = {
  SPECTATOR: 'spectator'
};