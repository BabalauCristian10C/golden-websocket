const WebSocket = require('ws');
const PORT = 8080;
const wsServer = new WebSocket.Server({
    port: PORT
});
wsServer.on('connection', function (socket) {
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

        wsServer.clients.forEach(function (client) {
            client.send("ss"+msg);
        });

    });

});

console.log( (new Date()) + " Server is listening on port " + PORT);