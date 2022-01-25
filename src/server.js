const routes = require('./routes')
require('./database')

const express = require('express')
const app = express();
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(routes)

const server = require('http').Server(app)
const io = require('socket.io')(server)
app.request.io = io

server.listen(5000)

console.log('rodando na porta 5000')