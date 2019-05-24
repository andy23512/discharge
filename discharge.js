#!/usr/bin/env node

const express = require('express')
const http = require('http')
const path = require('path')
const readline = require('readline')
const ws = require('ws')

const app = express()
app.use(express.static(path.join(__dirname, 'frontend/dist/frontend')))
const server = http.createServer(app)
const wss = new ws.Server({ server })

let totalData = ''

process.stdin.on('data', rawData => {
  const data = rawData.toString()
  totalData += data
  wss.clients.forEach(client => {
    client.send(JSON.stringify({message: data}))
  })
})

wss.on('connection', socket => {
  socket.send(JSON.stringify({message: totalData}))
  socket.on('error', (err) => {
    console.warn(`Client disconnected - reason: ${err}`)
  })
})

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`)
})

