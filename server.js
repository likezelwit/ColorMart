const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html'); });

let onlineUsers = [];

io.on('connection', (socket) => {
    onlineUsers.push(socket.id);
    io.emit('update-users', onlineUsers); // Beritahu semua orang siapa saja yang online
    socket.emit('my-id', socket.id);

    socket.on('private-message', (data) => {
        io.to(data.targetId).emit('chat message', {
            from: socket.id,
            message: data.msg
        });
    });

    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(id => id !== socket.id);
        io.emit('update-users', onlineUsers);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log('Server Ready!'); });
