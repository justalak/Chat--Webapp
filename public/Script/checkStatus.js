
var user_id = $('#profile-img').attr('user_id');
var socket = io();
socket.emit('connected', { user_id: user_id });
socket.emit('check-status');

socket.on('online-list', function (listid) {
    
    listid.forEach(user_id => {
        var friend = $('.contact[user_id=' + user_id + ']').find('.contact-status');
        $(friend).removeClass('busy');
        $(friend).addClass('online');
    });
})
socket.on('user-online',function(user_id){
    var friend = $('.contact[user_id=' + user_id + ']').find('.contact-status');
        $(friend).removeClass('busy');
        $(friend).addClass('online');
})
socket.on('user-offline',function(user_id){
    var friend = $('.contact[user_id=' + user_id + ']').find('.contact-status');
        $(friend).removeClass('online');
        $(friend).addClass('busy');
})





