const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io')
const port = 5000;
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5000', 'https://chat-app-by-jeswin.onrender.com']
  }
});
let messages=[];
let bannedUsers=[];

app.use(express.static('./src'));

io.on('connection', socket => {
  var isBanned;

  socket.emit('messagesArr', messages);
  socket.on('new-user',(userName) => {
    bannedUsers.forEach(user => {
      isBanned = true;
    })
    if(!isBanned) {
      socket.broadcast.emit('new-user', userName);
    }
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
app.get('/ban/', (req, res) => {
  const banMessages = [];
  const user = req.query.user;
  bannedUsers.push(user);
  messages.forEach(message => {
    if(message.userName === user) {
      banMessages.push(message)
    }
  });
  banMessages.forEach(message => {
    index = messages.indexOf(message);
    messages.splice(index, 1);
  })
  io.emit('ban-user', user);
  res.send('Successfully banned the user!')
})
server.listen(port, console.log(`Port: ${port}`));