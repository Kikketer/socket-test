const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 3005 })
const PING_TIME = 30000

wss.on('connection', function connection(ws) {
  ws.on('message', message => {
    console.log('received: %s', message)
    ws.isAlive = true
  })

  ws.on('pong', heartbeat)
  ws.on('close', () => {})

  sendStuff(ws)
})

function heartbeat() {
  console.log(`Still Alive!`)
  this.isAlive = true
}

setInterval(() => {
  console.log('Seeing if clients are alive')
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate()

    ws.isAlive = false
    ws.send('ping')
  })
}, PING_TIME)

function sendStuff(ws) {
  setInterval(() => {
    try {
      ws.send(
        JSON.stringify({
          data: {
            thing: 'abc'
          }
        })
      )
    } catch (err) {
      // console.log('Send failed, is it alive? ', err)
    }
  }, 5000)
}
