const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));
const server = createServer(app);
const wss = new WebSocket.Server({ server });
let connected = [], id = 0;

console.log(process.env)

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

let i = 0

wss.on('connection', function (socket) {
    console.log("A client just connected");
    addClient(socket)
    socket.on('message', function (msg) {
        new_message = JSON.parse(msg)
        console.log(process.env.BOT_URL)
        if (new_message.botConnection){
            console.log("Bot url established")
            process.env.BOT_URL = socket
        } else {
            if(new_message.bot){
                try{
                    const formatedMessage = JSON.stringify({
                        "message": new_message,
                        "sender": findClientIdByValue(socket)
                    })
                    process.env.BOT_URL.send(formatedMessage)  
                    console.log("message is sent to bot")
                } catch {
                    console.log("no bot link is set")
                }
            } else {
                receiver = new_message['receiver']
                message = new_message['message']
                findClientValueById(receiver).send(message)
                console.log("message is sent to the user")
                console.log(message)
            }
        }
    });
    socket.on('close', ()=>{
        console.log('a client disconnected')
        removeClientByValue(socket)
    })
});

server.listen(8080, function () {
    console.log('Listening on http://0.0.0.0:8080');
});