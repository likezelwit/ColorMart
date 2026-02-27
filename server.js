const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('User terhubung');
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Kirim ke semua user
  });

  socket.on('disconnect', () => {
    console.log('User keluar');
  });
});

http.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});
