
import http from 'http'
import fs from 'fs'
import { WebSocketServer } from 'ws'

const PORT = 3001

// Create HTTP server
const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500)
      res.end('Internal Server Error')
      return
    }

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(data)
  })
})

// Create WebSocket server
const wss = new WebSocketServer({ server })

// Helper function to broadcast messages
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message))
    }
  })
}

// Listen for new connections
wss.on('connection', (socket, req) => {

  // Get username and broadcast join message
  const username = new URL(
    req.url,
    'http://localhost'
  ).searchParams.get('username')

  broadcast({
    type: 'system',
    text: `${username} joined`
  })

  // Listen for incoming messages
  socket.on('message', (message) => {
    const { username, text } = JSON.parse(message)

    broadcast({
      type: 'chat',
      username,
      text
    })
  })

  // Listen for disconnections
  socket.on('close', () => {
    broadcast({
      type: 'system',
      text: `${username} left`
    })
  })
})

// Start HTTP and WebSocket server
server.listen(PORT, () => {
  console.log('Chat server running at http://localhost:3001')
})