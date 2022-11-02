const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));
const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function (socket) {

    console.log("A client just connected");
    socket.on('message', function (msg) {
        console.log(msg.toString())
        new_message = JSON.parse(msg.toString())
        wss.clients.forEach(sock=>{
            sock.send("message from the server")
        })
        if (new_message.botConnection){
            console.log("bot is conected")
        } else {
            if(new_message.bot){
                const formatedMessage = JSON.stringify({
                    "message": new_message,
                    "sender": new_message.sessionId,
                    "bot":true
                })
                wss.clients.forEach(sock=>{
                    sock.send(formatedMessage)
                })
            } else {
                receiver = new_message['receiver']
                message = new_message['message']
                wss.clients.forEach(sock=>{
                    sock.send(JSON.stringify({"message":message, "sender":receiver, "bot":false}))
                })
                console.log(message)
            }
        }
    });
    socket.on('close', ()=>{
        console.log("socked closed")
    })
});

server.listen(8080, function () {
    console.log('Listening on http://0.0.0.0:8080');
});