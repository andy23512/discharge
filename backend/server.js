const express = require('express')
const http = require('http')
const readline = require('readline')
const ws = require('ws')

const app = express()
const server = http.createServer(app)
const wss = new ws.Server({ server })

process.stdin.on('data', data => {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({message: data.toString()}))
  })
})

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`)
})

