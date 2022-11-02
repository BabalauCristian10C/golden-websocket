const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));
const server = createServer(app);
const wss = new WebSocket.Server({ server });
let connected = [], id = 0;

function addClient(client){
    connected.push([id, client])
    return id++;
}

function findClientValueById(id){
    return connected.filter(item => item[0]==id)[0][1]
}
function findClientIdByValue(client){
    return connected.filter(item => item[1]==client)[0][0]
}
function removeClientById(id){
    return connected = connected.filter(item => item[0]!==id)
}

function removeClientByValue(client){
    return connected = connected.filter(item => {
        item[1]!==client
    })
}

wss.on('connection', function (socket) {
    console.log("A client just connected");
    socket.on('message', function (msg) {
        new_message = JSON.parse(msg)
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
                console.log("message is sent to the user")
                console.log(message)
            }
        }
    });
    socket.on('close', ()=>{
        console.log('a client disconnected')
    })
});

server.listen(8080, function () {
    console.log('Listening on http://0.0.0.0:8080');
});