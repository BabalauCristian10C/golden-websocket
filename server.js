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
        console.log(msg)
        try {
            new_message = JSON.parse(msg.toString())
        } catch {
            new_message = JSON.parse(msg)
        }
        console.log(new_message)
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
                    sock.send(JSON.stringify({"message": "message intended for the bot"}))
                })
                console.log("message is sent to bot" + formatedMessage)
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
    socket.on('pong',function(mess) { console.log("you are still alive"); });
    socket.on("close", ()=>{
        socket.close()
        console.log('someone disconnected')
        console.log(wss.clients)
    })
});

server.listen(8000, function () {
    console.log('Listening on http://0.0.0.0:8080');
});