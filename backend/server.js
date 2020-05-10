const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('../site'));

app.get('/', (req,res) => {
    res.sendFile('../site/index.html');
});

io.on('connection', socket => {
    socket.emit('socketID', socket.id);
    socket.on('getRooms', () => {
        socket.emit('availableRooms', socket.rooms);
    });
    socket.on('joinRoom', data => {
        socket.join(data);
    });
    socket.on('getUsers', data => {
        socket.emit('currentUsers', io.sockets.adapter.rooms[data]);
    });
    socket.on('startGetUsers', data => {
        socket.emit('startCurrentUsers', io.sockets.adapter.rooms[data]);
    });
    socket.on('joinChat', data => {
        io.emit('joinChat', data);
    });
    socket.on('lobbyChat', data => {
        io.emit('lobbyChat', data);
    });
    socket.on('gameChat', data => {
        io.to(data.sessionID).emit('gameChat', data);
    });
    socket.on('charUpdate', data => {
        io.to(data.sessionID).emit('charUpdate', data);
    });
    socket.on('charCheck', data => {
        io.to(data.sessionID).emit('charCheck', data);
    });
    socket.on('startGame', data => {
        io.to(data).emit('startGame', data);
    });
    socket.on('getPlayerInfo', data => {
        io.to(data.sessionID).emit('getPlayerInfo', data);
    });
    socket.on('roll', data => {
        io.to(data.sessionID).emit('roll', data);
    });
    socket.on('decideRolled', data => {
        io.to(data.sessionID).emit('decideRolled', data);
    });
    socket.on('tilesData', data => {
        io.to(data.sessionID).emit('tilesData', data);
    });
    socket.on('moveRolled', data => {
        io.to(data.sessionID).emit('moveRolled', data);
    });
    socket.on('battleRoll', data => {
        io.to(data.sessionID).emit('battleRoll', data);
    });
    socket.on('battleRolled', data => {
        io.to(data.player.sessionID).emit('battleRolled', data);
    });
});

http.listen(8080, () => {
    console.log('Running on PORT 8080');
});
