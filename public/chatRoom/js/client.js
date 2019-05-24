'use strict'
//获取页面控件
var userName = document.querySelector('input#userName');
var inputRoom = document.querySelector('input#room');
var connectBtn = document.querySelector('button#connect');
var leaveBtn = document.querySelector('button#leave');
var outputText = document.querySelector('textarea#output');
var inputText = document.querySelector('textarea#input');
var sendBtn = document.querySelector('button#send');

//定义全局属性
var socket;
var room;

//事件键盘
connectBtn.onclick = function () {
  //connect
  socket = io.connect(); // io 从哪来？
  //recieve message
  socket.on('joined', (room, id) => {
    connectBtn.disabled = true;
    leaveBtn.disabled = false;
    inputText.disabled = false;
    sendBtn.disabled = false;
  });

  socket.on('leaved', (room, id) => {
    connectBtn.disabled = false;
    leaveBtn.disabled = true;
    inputText.disabled = true;
    sendBtn.disabled = true;
    socket.disconnect();
  });
  socket.on('message', (room, id, data) => {
    outputText.scrollTop = outputText.scrollHeight; //显示最后的内容
    outputText.value = outputText.value + data + '\r';
  });

  socket.on('disconnect', (socket) => {
    connectBtn.disabled = false;
    leaveBtn.disabled = true;
    inputText.disabled = true;
    sendBtn.disabled = true;
  });
  //send message
  room = inputRoom.value;
  socket.emit('join', room);
}

sendBtn.onclick = function () {
  var msg = inputText.value;
  msg = userName.value + ':' + msg;
  socket.emit('message', room, msg);
  inputText.value = '';
}

leaveBtn.onclick = function () {
  room = inputRoom.value;
  socket.emit('leave', room);
}

inputText.onkeypress = function (event) {
  if (event.keyCode == 13) { //回车发送消息
    var msg = inputText.value;
    msg = userName.value + ':' + msg;
    socket.emit('message', room, msg);
    inputText.value = '';
    event.preventDefault(); //阻止Web默认行为
  }
}