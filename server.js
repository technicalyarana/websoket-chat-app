const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve your HTML, CSS, and JavaScript files
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket server code
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // WebSocket event handlers
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    // Send a response back to the client
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
