'use strict'

var http = require('http');
var https = require('https');
var fs = require('fs')
var socketIo = require('socket.io');
var log4js = require('log4js');

var express = require('express');
var serveIndex = require('serve-index');


var MAX_USER_COUNT = 4;

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'app.log',
      layout: {
        type: 'pattern',
        pattern: '%r %p - %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'debug'
    }
  }

});

var logger = log4js.getLogger();

var app = express()
app.use(serveIndex('./public'));
app.use(express.static('./public'));

//http server
var http_server = http.createServer(app);
//bind socketio with http_server
var sockio = socketIo.listen(http_server);
//connection
sockio.sockets.on('connection', (socket) => {
  //接收消息
  socket.on('message', (room, data) => {
    socket.to(room).emit('message', room, socket.id, data); //给房间所有人发消息（除自己）
  });
  //此处应该加锁
  socket.on('join', (room) => {
    socket.join(room);
    var myRoom = io.sockets.adapter.rooms[room];
    var users = Object.keys(myRoom.sockets).length;

    logger.log('the number of user in room is :' + users);

    //控制房间人数
    if (users < MAX_USER_COUNT) {
      socket.emit('joined', room, socket.id);
      if (users > 1) {
        socket.to(room).emit('otherjoin', room); //给除自己外发消息
      }
    } else {
      socket.leave(room);
      socket.emit('full', room, socket.io);
    }
    // socket.to(room).emit('joined', room, socket.id);//房间内除自己之外
    // io.in(room).emit('joined', room, socket.id);//房间内所有人
    // socket.broadcast.emit('joined', room, socket.id);//除自己，全部站点	
  });
  socket.on('leave', (room) => {
    var myRoom = io.sockets.adapter.rooms[room];
    var users = Object.keys(myRoom.sockets).length;
    logger.log('the number of user in room is :' + (users - 1));
    socket.leave(room);
    socket.to(room).emit('bye', room, socket.id); //给房间所有人（自己除外）
    socket.emit('leaved', room, socket.id); //给自己
  });

});


http_server.listen(80, '0.0.0.0');

//https server
var options = {
  key: fs.readFileSync('./cert/server.key'),
  cert: fs.readFileSync('./cert/server.crt')
}
//  create servers
var https_server = https.createServer(options, app);

//1 bind socket.io with https_server  io节点可以有多少个房间
var io = socketIo.listen(https_server);

//2 connection  and  event
io.sockets.on('connection', (socket) => {

  //接收消息
  socket.on('message', (room, data) => {
    socket.to(room).emit('message', room, socket.id, data); //给房间所有人发消息（除自己）
  });
  //此处应该加锁
  socket.on('join', (room) => {
    socket.join(room);
    var myRoom = io.sockets.adapter.rooms[room];
    var users = Object.keys(myRoom.sockets).length;
    logger.log('the number of user in room is :' + users);
    //控制房间人数
    if (users < MAX_USER_COUNT) {
      socket.emit('joined', room, socket.id);
      if (users > 1) {
        socket.to(room).emit('otherjoin', room); //给除自己外发消息
      }
    } else {
      socket.leave(room);
      socket.emit('full', room, socket.io);
    }
    // socket.to(room).emit('joined', room, socket.id);//房间内除自己之外
    // io.in(room).emit('joined', room, socket.id);//房间内所有人
    // socket.broadcast.emit('joined', room, socket.id);//除自己，全部站点	
  });
  socket.on('leave', (room) => {
    var myRoom = io.sockets.adapter.rooms[room];
    var users = Object.keys(myRoom.sockets).length;
    logger.log('the number of user in room is :' + (users - 1));

    socket.leave(room);

    socket.to(room).emit('bye', room, socket.id); //给房间所有人（自己除外）
    socket.emit('leaved', room, socket.id);
  });
});
//3 绑定端口
https_server.listen(443, '0.0.0.0');