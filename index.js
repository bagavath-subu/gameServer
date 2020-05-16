const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 5000;
const app = express();
var cors = require('cors')
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors())

let user = {}

app.get('/', (req, res) => {
    res.send("welcome to game server")
})

io.on("connection", socket => {
    socket.on('user-name', name => {
        user[socket.id] = name
        console.log(name, "  connected")
    })

    socket.on('room', (room) => {
        socket.join(room);
        console.log(`${user[socket.id]}  joined the room`)
        socket.in(room).broadcast.emit('User-connected', user[socket.id])
    });

    socket.on('startGame', (room) => {
        io.to(room).emit('startingGame')
    });

    socket.on('stateChanged', (state) => {
        state.name = user[socket.id]
        console.log("state", state)
        console.log("Users", user, "socket", socket.id, "State Changed : ", user[socket.id])
        socket.in(state.roomId).broadcast.emit("updateState", state);
    });

    socket.on('bingo', () => {
        const name = user[socket.id]
        socket.in(room).broadcast.emit("GameOver", name);
    });

    socket.on("disconnect", () => console.log("Client disconnected", socket.id));
});

server.listen(port, () => console.log(`Listening on port ${port}`));


//Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
// socket.broadcast.emit("outgoing data", {num: data});