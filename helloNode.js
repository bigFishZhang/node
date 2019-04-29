//使用最严格的语法
'use strict'
//引入http模块
var http = require('http');
//创建服务 
var app =http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('Hello NodeJS \n');
}).listen(8080,'0.0.0.0');