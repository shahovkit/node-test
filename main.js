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

    socket.on('disconnect', (player)=>{
        $('#'+player.name).remove();
    });

    socket.on('new_player', (obj)=>{
        $( "body" ).append( '<div class="player" style="background: #'+obj.new_player.color+'; top:'+obj.new_player.coords.top+'px;left:'+obj.new_player.coords.left+'px;" id="'+obj.new_player.name+'"></div>' );
        $.each( obj.players, function( index, player ){
            if($('#'+player.name).length = 0){
                $( "body" ).append( '<div class="player" style="background: #'+player.color+'; top:'+player.coords.top+'px;left:'+player.coords.left+'px;" id="'+player.name+'"></div>' );
            }

        });

    });

socket.on('change_player', (player)=>{
    $('#'+player.name).css({top:player.coords.top,left:player.coords.left});
});

$( window ).keypress(function( event ) {

    if (event.which === 97 || event.which === 100 || event.which === 115 || event.which === 119) {
        event.preventDefault();
        socket.emit('keypress', event.which)
    }
});




