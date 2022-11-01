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
    botUrl = undefined
    socket.on('message', function (msg) {
        console.log("Received message from client: "  + msg);
        new_message = JSON.parse(msg)
        if (new_message.botConnection){
            botUrl = socket
        } else {
            if(new_message.bot){
                try{
                    botUrl.send("message to you") 
                } catch {
                    console.log("no bot link is set")
                }
            }
        }

        wss.clients.forEach(function (client) {
            client.send("ss"+msg);
        });
    });
});

server.listen(8080, function () {
    console.log('Listening on http://0.0.0.0:8080');
  });