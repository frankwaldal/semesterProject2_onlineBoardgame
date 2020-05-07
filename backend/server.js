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
    socket.on('p1Roll', data => {
        io.to(data).emit('p1Roll');
    });
    socket.on('p1Rolled', data => {
        io.to(data.sessionID).emit('p1Rolled', data);
    });
    socket.on('p2Roll', data => {
        io.to(data).emit('p2Roll');
    });
    socket.on('p2Rolled', data => {
        io.to(data.sessionID).emit('p2Rolled', data);
    });
    socket.on('p1MoveRolled', data => {
        io.to(data.sessionID).emit('p1MoveRolled', data);
    });
    socket.on('p2MoveRolled', data => {
        io.to(data.sessionID).emit('p2MoveRolled', data);
    });
    socket.on('p1BattleRoll', data => {
        io.to(data).emit('p1BattleRoll');
    });
    socket.on('p1BattleRolled', data => {
        io.to(data.sessionID).emit('p1BattleRolled', data);
    });
    socket.on('p2BattleRoll', data => {
        io.to(data).emit('p2BattleRoll');
    });
    socket.on('p2BattleRolled', data => {
        io.to(data.sessionID).emit('p2BattleRolled', data);
    });
});

http.listen(8080, () => {
    console.log('Running on PORT 8080');
});
