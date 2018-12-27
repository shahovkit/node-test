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



io.on('connection', async socket => {

    setInterval(()=>{
        io.emit('change_player', players[String(Math.abs(generateId(socket.handshake.address)))]);
    },40);

    console.log('New user connected ' + String(Math.abs(generateId(socket.handshake.address))));
    players[String(Math.abs(generateId(socket.handshake.address)))] = {name:'player'+String(Math.abs(generateId(socket.handshake.address))), color: intToRGB(hashCode(socket.handshake.address)), coords:{top:100,left:100}};
    io.emit('new_player', {players:players,new_player:players[Math.abs(generateId(socket.handshake.address))] });

    socket.on('disconnect', function(){
        io.emit('disconnect', players[String(Math.abs(generateId(socket.handshake.address)))]);
        players[String(Math.abs(generateId(socket.handshake.address)))] = undefined;
        console.log('user '+String(Math.abs(generateId(socket.handshake.address)))+' disconnected');
    });
    let W,A,S,D;

    socket.on('keydown', function(key){
        switch (key) {
            case 83://S
                S = setInterval(()=>{
                    players[String(Math.abs(generateId(socket.handshake.address)))].coords.top += 10;
                },40);
                break;
            case 68://D
                D = setInterval(()=>{
                    players[String(Math.abs(generateId(socket.handshake.address)))].coords.left += 10;
                },40);
                break;
            case 87://W
                W = setInterval(()=>{
                    players[String(Math.abs(generateId(socket.handshake.address)))].coords.top -= 10;
                },40);
                break;
            case 65://A
                A = setInterval(()=>{
                    players[String(Math.abs(generateId(socket.handshake.address)))].coords.left -= 10;
                },40);
                break;
        }
    });

    socket.on('keyup', function(key){
        switch (key) {
            case 83:
                clearInterval(S);
                break;
            case 68:
                clearInterval(D);
                break;
            case 87:
                clearInterval(W);
                break;
            case 65:
                clearInterval(A);
                break;
        }
    });
});

http.listen(8802, function(){
    console.log('listening on *:8802');
});