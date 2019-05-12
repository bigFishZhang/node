'use strict'

var http = require('http');
var https = require('https');
var fs = require('fs')

var express = require('express');
var serveIndex =  require('serve-index');

var app = express()
app.use(serveIndex('./public'));
app.use(express.static('./public'));

//http server
var http_server = http.createServer(app);
http_server.listen(80,'0.0.0.0');

//https server
var options = {
    key: fs.readFileSync('./cert/server.key'),
    cert: fs.readFileSync('./cert/server.crt')
}
var https_server = https.createServer(options,app);
https_server.listen(443,'0.0.0.0');



