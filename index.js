const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = 5000;
const app = express();
var cors = require('cors')
const server = http.createServer(app);
const io = socketIo(server);


app.use(cors())

const user = {}


io.on("connection", socket => {
    socket.on('user-name', name => {
        user[socket.id] = name
        console.log(name)
        socket.broadcast.emit('User-connected', name)
    })

    socket.on('stateChanged', function (state) {
        socket.broadcast.emit("updateState", state);
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
});


server.listen(port, () => console.log(`Listening on port ${port}`));


//Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
// socket.broadcast.emit("outgoing data", {num: data});