const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = 5000;
const app = express();
var cors = require('cors')
const server = http.createServer(app);
const io = socketIo(server);


app.use(cors())

let user = {}


io.on("connection", socket => {
    socket.on('user-name', name => {
        user[socket.id] = name
        console.log(name, "  connected")
        socket.broadcast.emit('User-connected', name)
    })

    socket.on('stateChanged', (state) => {
        state.name = user[socket.id]
        console.log("Users", user, "socket", socket.id, "State Changed : ", user[socket.id])
        socket.broadcast.emit("updateState", state);
    });

    socket.on('bingo', () => {
        const name = user[socket.id]
        socket.broadcast.emit("GameOver", name);
    });
    
    socket.on("disconnect", () => console.log("Client disconnected", socket.id));
});


server.listen(port, () => console.log(`Listening on port ${port}`));


//Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
// socket.broadcast.emit("outgoing data", {num: data});