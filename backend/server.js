const express = require('express')
const http = require('http')
const readline = require('readline')
const ws = require('ws')

const rl = readline.createInterface({
  input: process.stdin,
  output: null,
  terminal: false
})
rl.on('line', function(line){
    console.log('line', line)
})

const app = express()
const server = http.createServer(app)
const wss = new ws.Server({ server })

wss.on('connection', socket => {
  socket.send({
    message: 'nanoha'
  })

  socket.on('error', (err) => {
    console.warn(`Client disconnected - reason: ${err}`)
  })
})

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`)
})

