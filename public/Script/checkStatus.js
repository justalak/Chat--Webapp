
var user_id = $('#profile-img').attr('user_id');
var socket = io();
socket.emit('connected', { user_id: user_id });
socket.emit('check-status');
var onlineList=[];

socket.on('online-list', function (listid) {
    listid.forEach(user_id => {
        var friend = $('.contact[user_id=' + user_id + ']').find('.contact-status');
        $(friend).removeClass('busy');
        $(friend).addClass('online');
    });
})

function checkStatusUser(){

    $('.contact').find('.contact-status').removeClass('online');
    $('.contact').find('.contact-status').addClass('busy');

    onlineList.forEach(user_id => {
        var friend = $('.contact[user_id=' + user_id + ']').find('.contact-status');
        $(friend).removeClass('busy');
        $(friend).addClass('online');
    });
}

socket.on('user-online',function(user_id){
    if(onlineList.indexOf(user_id)!=-1){
        onlineList.push(user_id);
    }
    debugger
    checkStatusUser();
})
socket.on('user-offline',function(user_id){
    if(onlineList.indexOf(user_id)!=-1){
        onlineList.splice(onlineList.indexOf(user_id),1);
    }
   //checkStatusUser();
})





