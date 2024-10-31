const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io')
const port = 5000;
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5000', 'https://chat-app-by-jeswin.onrender.com/']
  }
});
let messages=[];

app.use(express.static('./src'));

io.on('connection', socket => {
  socket.emit('messagesArr', messages);
  socket.on('new-user',(userName) => {
    socket.broadcast.emit('new-user', userName);
  });
  socket.on('chat-message', data => {
    messages.push(data);
    socket.broadcast.emit('chat-message', data);
  });
});
app.get('/clear/Jai2021', (req, res) => {
  messages = [];
  res.send('The Chat has successfully been cleared!');
  io.sockets.emit('chatCleared')
})

app.get('/msg', (req, res) => {
  const msg = req.query.msg;
  res.send(msg + '<a href="/">Click Here to go back.</a>');
})

server.listen(port, console.log(`Port: ${port}`));