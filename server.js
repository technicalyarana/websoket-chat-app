const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients and their usernames
const clients = new Map();

// Serve your HTML, CSS, and JavaScript files
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket server code
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the chat! Please enter your username.');

  ws.on('message', (message) => {
    if (!clients.has(ws)) {
      // If the client doesn't have a username, set it as the received message
      clients.set(ws, message);
      ws.send(`You are now known as "${message}"`);
    } else {
      const sender = clients.get(ws);

      // Broadcast the message to all connected clients (except the sender)
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`${sender}: ${message}`);
        }
      });
    }
  });

  ws.on('close', () => {
    const username = clients.get(ws);
    clients.delete(ws);
    console.log(`WebSocket client disconnected: ${username}`);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
