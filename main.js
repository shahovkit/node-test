$(document).keypress(function(e) {
    if(e.which == 13 && $('textarea:focus').length > 0) {
        e.preventDefault();
        socket.emit('message', $('textarea:focus').val());
        $('textarea:focus').html($('textarea:focus').val()+'\n');
        $('textarea:focus').val(null);
    }
});

var socket = io('http://127.0.0.1:3000');

    socket.on('getmessage', function(msg){
        $('.chat').append('<div style="background: #'+msg.color+';">'+msg.msg+'</div>')
    });
    socket.on('disconnect', function(){console.log('disconnect')});


