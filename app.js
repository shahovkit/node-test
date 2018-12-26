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

app.get('/env.js', function(req, res){
    res.sendFile(__dirname + '/env.js');
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

generateId = ip => {
        return ip.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });

let players = {};

// setInterval(()=>{
//     io.emit('players_loop', {players:players,new_player });
//     },16);

io.on('connection', function(socket){

    console.log('New user connected ' + String(Math.abs(generateId(socket.handshake.address))));
    players[String(Math.abs(generateId(socket.handshake.address)))] = {name:'player'+String(Math.abs(generateId(socket.handshake.address))), color: intToRGB(hashCode(socket.handshake.address)), coords:{top:100,left:100}};
    io.emit('new_player', {players:players,new_player:players[Math.abs(generateId(socket.handshake.address))] });

    socket.on('disconnect', function(){
        io.emit('disconnect', players[String(Math.abs(generateId(socket.handshake.address)))]);
        players[String(Math.abs(generateId(socket.handshake.address)))] = undefined;
        console.log('user '+String(Math.abs(generateId(socket.handshake.address)))+' disconnected');
    });

    socket.on('keypress', function(key){
        if(key==115){
            players[String(Math.abs(generateId(socket.handshake.address)))].coords.top += 10;
            io.emit('change_player', players[String(Math.abs(generateId(socket.handshake.address)))]);
        }
        if(key==100){
            players[String(Math.abs(generateId(socket.handshake.address)))].coords.left += 10;
            io.emit('change_player', players[String(Math.abs(generateId(socket.handshake.address)))]);
        }
        if(key==119){
            players[String(Math.abs(generateId(socket.handshake.address)))].coords.top -= 10;
            io.emit('change_player', players[String(Math.abs(generateId(socket.handshake.address)))]);
        }
        if(key==97){
            players[String(Math.abs(generateId(socket.handshake.address)))].coords.left -= 10;
            io.emit('change_player', players[String(Math.abs(generateId(socket.handshake.address)))]);
        }
    });
});

http.listen(8802, function(){
    console.log('listening on *:8802');
});