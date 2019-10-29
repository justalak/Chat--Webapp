
var user_send=$('#profile-img').attr('user_id');

/**
 * Hàm thực hiện thêm tin nhắn vào giao diện
 */
function addMessage(type,message,friend_id) {
    var friend=getUser(friend_id);
    var sender;
    $('<li class='+type+'><img src="../Images/default_avt.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    if( type=='sent') sender='You';
    else sender=friend.lastname;
    $('.contact.active .preview').html('<span>'+sender+ ': </span>' + message);
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");
}
/**
 * Hàm thực hiện gửi tin nhắn
 */
function newMessage() {
    message = $(".message-input input").val();
    if ($.trim(message) == '') {
        return false;
    }
    addMessage('sent',message);
    var user_receive= $('#conversation ul li.active').attr('user_id');
    var conv_id=$('#conversation ul li.active').attr('conv_id');
    debugger
    socket.emit('new-message',{user_send:user_send,user_receive:user_receive,conv_id:conv_id,content:message});
};

socket.on('new-message',function (message) {
   
    var messaging=$('#conversation .contact.active').attr('user_id');
    if(message.user_send==messaging){
        addMessage('replies',message.content,message.user_send);
    }
    else{
        var friend=getUser(message.user_send);
        var test=$('.contact[user_id='+message.user_send+'] .preview');
        
        test.html('<span>'+friend.lastname+': </span>' + message.content);
    }
})

$('.submit').click(function () {
    newMessage();
});

$(window).on('keydown', function (e) {
    if (e.which == 13) {
        newMessage();
        return false;
    }
});
