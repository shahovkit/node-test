$(document).keypress( e => {
    if(e.which == 13 && $('textarea:focus').length > 0) {
        e.preventDefault();
        socket.emit('message', $('textarea:focus').val());
        $('textarea:focus').html($('textarea:focus').val()+'\n');
        $('textarea:focus').val(null);
    }
});

var socket = io('http://'+IP);

    socket.on('connect', ()=>{
        console.log('connect')
    });

    socket.on('new_player', (player)=>{
        $( "body" ).append( '<div class="player" style="background: #'+player.color+'; top:'+player.coords.top+'px;left:'+player.coords.left+'px;" id="'+player.name+'"></div>' );
        console.log(player)
    });

socket.on('change_player', (player)=>{
    console.log(player);
    $('#'+player.name).css({top:player.coords.top,left:player.coords.left});
});

$( window ).keypress(function( event ) {

    if (event.which === 97 || event.which === 100 || event.which === 115 || event.which === 119) {
        event.preventDefault();
        socket.emit('keypress', event.which)
    }
});




