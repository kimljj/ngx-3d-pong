import http from 'http';
import { SocketServer } from './SocketServer';

// Create HTTP server
const httpServer = http.createServer();

// Create socket server
new SocketServer(httpServer);
