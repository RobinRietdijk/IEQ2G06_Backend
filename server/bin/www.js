#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from '../app';
import http from 'http';
import SocketController from '../socket/SocketController';
import { appLogger as logger } from '../utils/logger';
import fs from 'fs/promises';

let server;
const startServer = async () => {
  try {
    // Specify the path to your secrets file
    const secretsFilePath = './secrets.json';

    // Load secrets and set environment variables
    const secrets = await loadSecrets(secretsFilePath);
    setEnvironmentVariables(secrets);

    // Get port from environment and store in Express.
    const port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    // Create HTTP server.
    server = http.createServer(app);

    // Setup socket.io server.
    const sc = new SocketController();
    sc.initSocketController(server);
    app.set('socket', sc.io);

    // Listen on provided port, on all network interfaces.
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  } catch (error) {
    console.error(`Error starting the server: ${error.message}`);
    process.exit(1);
  }
};

// Run the server start process
startServer();

async function loadSecrets(filePath) {
  try {
    const secretsRaw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(secretsRaw);
  } catch (error) {
    console.error(`Error reading secrets file: ${error.message}`);
    return {};
  }
};

function setEnvironmentVariables(secrets) {
  Object.entries(secrets).forEach(([key, value]) => {
    process.env[key] = value;
  });
};

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : addr.address + ":" + addr.port;
  logger.info(`Listening on ${addr.address}:${bind}`);
}
