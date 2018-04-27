var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require('fs');
var index = fs.readFileSync('index.html');
var io = require('socket.io').listen(server);
var serialPort = require('serialport');

const parsers = serialPort.parsers;

const parser = new parsers.Readline({
    delimiter: '\r\n'
});


var port = new serialPort('/dev/cu.usbmodem1421',{
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});



port.pipe(parser);

port.on('open', function(data) {
    console.log('Node is listening to port');
});

parser.on('data', function(data) {
    console.log('Received data from port: ' + data);
});

//added this

io.on('connection', function(socket){
   socket.on('fromClient', function(data){
       console.log('ON: fromClient');

        parser.on('data', function(data){

            socket.emit('fromServer', {message: data });
        });

       console.log('EMIT: fromServers');
   });
});



server.listen(process.env.PORT || 3000);
console.log("server running!");

app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});
