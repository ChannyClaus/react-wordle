import { WebSocket, WebSocketServer } from 'ws'

const port: number = 8080 || Number(process.env.PORT)
const wss = new WebSocketServer({ port })

wss.on('connection', function connection(ws) {
  // send the current state for the session
  // for the users that are newly joining.
  // ws.send(JSON.stringify({ currentGuess }), { binary: false })

  ws.on('error', console.error)

  // handle the state update from the client.
  ws.on('message', function message(data) {
    // currentGuess = JSON.parse(data.toString()).currentGuess
    console.log(wss.clients.size)
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: false })
      }
    })
    console.log('received: %s', data)
  })
})
