import { WebSocket, WebSocketServer } from 'ws'

const port: number = 8080 || Number(process.env.PORT)
const wss = new WebSocketServer({ port })

var currentGuess = ''

wss.on('connection', function connection(ws) {
  ws.send(JSON.stringify({ currentGuess }), { binary: false })

  ws.on('error', console.error)

  ws.on('message', function message(data) {
    currentGuess = JSON.parse(data.toString()).currentGuess
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ currentGuess }), { binary: false })
      }
    })
    console.log('received: %s', data)
  })
})
