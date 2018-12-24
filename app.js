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

generateId = ip => {
        return ip.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });

let players = {};

io.on('connection', function(socket){
    let id = String(Math.abs(generateId(socket.handshake.address)));
    console.log('New user connected ' + id);
    players[id] = {name:'player'+id, color: intToRGB(hashCode(socket.handshake.address)), coords:{top:100,left:100}};
    io.emit('new_player', players[id]);

    socket.on('disconnect', function(){
        players[id] = {};
        console.log('user disconnected');
    });

    socket.on('keypress', function(key){
        console.log('user keypress - '+key);
        if(key==115){
            players[id].coords.top += 10;
            io.emit('change_player', players[id]);
        }
        if(key==100){
            players[id].coords.left += 10;
            io.emit('change_player', players[id]);
        }
        if(key==119){
            players[id].coords.top -= 10;
            io.emit('change_player', players[id]);
        }
        if(key==97){
            players[id].coords.left -= 10;
            io.emit('change_player', players[id]);
        }
    });
});

http.listen(8802, function(){
    console.log('listening on *:8802');
});