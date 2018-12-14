const express = require('express');
const socketio = require('socket.io');
const http = require('http')

const app = express(); // creates express app
const server = http.Server(app) //creates http server using the app
const io = socketio(server) //adds a socket on above server
var usernames = [];

app.use('/', express.static(__dirname + '/public_static'))

io.on('connection', (socket) => {
  // all code here runs in the scope
  // of a single socket

  socket.on ('new user', function(data,callback) {
      if (usernames.indexOf(data) != -1) {
          callback(false);
      }
      else {
          callback(true);
          socket.username = data;
          usernames.push(socket.username);
          updateUsernames();
      }
  });

  function updateUsernames() {
      io.sockets.emit('usernames',username);
  }

  socket.on('send message', (data) => {

    io.emit('new message', {msg : data, user : socket.username});

  });

  socket.on('disconnect' , function(data) {
     if (!socket.username) {
         return;
     }
     
     usernames.splice(usernames.indexOf(socket.username),1);
     updateUsernames();

  });

})

server.listen(5656, function () {
  console.log("Server started on http://localhost:5656");
});