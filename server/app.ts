import cors from 'cors'
import express from 'express'
import { WebSocket, WebSocketServer } from 'ws'

const port: number = 8080 || Number(process.env.PORT)

const app = express()
app.use(cors())

var state = {}
app.get('/state', (req, res) => {
  console.log(state)
  res.json(state)
})

const server = app.listen(port)
const wss = new WebSocketServer({ server })

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  // handle the state update from the client.
  ws.on('message', function message(data) {
    state = { ...state, ...JSON.parse(data.toString()) }
    console.log('state: ', state)
    console.log(wss.clients.size)
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: false })
      }
    })
    console.log('received: %s', data)
  })
})
