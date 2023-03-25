import { WebSocket, WebSocketServer } from 'ws'

const port: number = 8080 || Number(process.env.PORT)
const wss = new WebSocketServer({ port })

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', function message(data, binary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary })
      }
    })
    console.log('received: %s', data)
  })
})
