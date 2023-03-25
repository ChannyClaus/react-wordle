import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', function message(data) {
    wss.clients.forEach(function each(client) {
      console.log('client: ', client)
      // if (client.readyState === WebSocket.OPEN) {
      client.send(data)
      // }
    })
    console.log('received: %s', data)
  })

  ws.send('something')
})
