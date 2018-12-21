var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/socket.io.js', function(req, res){
    res.sendFile(__dirname + '/socket.io.js');
});

app.get('/main.js', function(req, res){
    res.sendFile(__dirname + '/main.js');
});

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}
// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
    console.log('New user connected ' + socket.handshake.address);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('message', function(msg){
        console.log('message: ' + msg);

        io.emit('getmessage', {color:intToRGB(hashCode(socket.handshake.address)),msg:msg});

    });
});

http.listen(8802, function(){
    console.log('listening on *:8802');
});