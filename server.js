const express = require('express');
const app = express();

app.use(express.static('public'))

const http = require('http').Server(app);
const serverSocket = require('socket.io')(http);

const port = 8001;

http.listen(port, () => {
    console.log("Servidor Iniciado. Abra o navegador em http://localhost:" + port);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

serverSocket.on('connection', (socket) => {

    socket.on('login', (nickName) => {
        console.log('Cliente Conectado ' + nickName);
        serverSocket.emit('chat_msg', `Usuario ${nickName} conectou.`);
        socket.nickName = nickName
    })
    socket.on('chat_msg', (msg) => {
        console.log(`Mensagem recebida do cliente: ${socket.nickName}: ${msg}`);
        serverSocket.emit('chat_msg', `${socket.nickName}: ${msg}`);
    })
    socket.on('status', (msg) => {
        // console.log(`Mensagem recebida do cliente: ${socket.nickName}: ${msg}`);
        socket.broadcast.emit('status', msg);
    })
})