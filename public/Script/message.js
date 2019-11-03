var user_send=$('#profile-img').attr('user_id');

$('.submit').click(function () {
    newMessage();
});

$(window).on('keydown', function (e) {
    if (e.which == 13) {
        newMessage();
        return false;
    }
});
/**
 * Hàm thực hiện thêm tin nhắn vào giao diện
 */
function addMessage(type, message, friend_id) {
    var friend = getUser(friend_id);
    var sender;
    $('li.typing').remove();
    $('<li class=' + type + '><img src="../Images/default_avt.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    if (type == 'sent') sender = 'You';
    else sender = friend.lastname;
    $('.contact.active .preview').html('<span>' + sender + ': </span>' + message);
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
    addMessage('sent', message);
    var user_receive = $('#conversation ul li.active').attr('user_id');
    var conv_id = $('#conversation ul li.active').attr('conv_id');
    debugger
    socket.emit('new-message', { user_send: user_send, user_receive: user_receive, conv_id: conv_id, content: message });
};

socket.on('new-message', function (message) {

    var messaging = $('#conversation .contact.active').attr('user_id');
    if (message.user_send == messaging) {
        addMessage('replies', message.content, message.user_send);
    }
    else {
        var friend = getUser(message.user_send);
        var test = $('.contact[user_id=' + message.user_send + '] .preview');

        test.html('<span>' + friend.lastname + ': </span>' + message.content);
    }
})
/**
 * thực hiện gửi event socket typing on
 */
$(".message-input input").on('keypress', function () {
    var user_receive = $('#conversation ul li.active').attr('user_id');
    var conv_id = $('#conversation ul li.active').attr('conv_id');
    socket.emit('typing-on', { user_send: user_send, user_receive: user_receive, conv_id: conv_id });
})

/**
 * thực hiện gửi event socket typing off
 */

$(".message-input input").on('blur', function () {
    var user_receive = $('#conversation ul li.active').attr('user_id');
    var conv_id = $('#conversation ul li.active').attr('conv_id');
    socket.emit('typing-off', { user_send: user_send, user_receive: user_receive, conv_id: conv_id });
})

socket.on('typing-on', (data) => {
    var messaging = $('#conversation .contact.active').attr('user_id');

    if (data.user_send == messaging) {
        if (!$('.messages li:last-child').hasClass('typing')) {
            var typing = '<img id="typing" src="../../Images/typing.gif"></img>';
            $('<li class="replies typing"><img src="../Images/default_avt.png" alt="" /><p>' + typing + '</p></li>').appendTo($('.messages ul'));
        }
    }
    else {
        var friend = getUser(data.user_send);
        var test = $('.contact[user_id=' + data.user_send + '] .preview');

        test.html('<span>' + friend.lastname + ': </span>' + ' is typing...');
    }
})

socket.on('typing-off',(data)=>{
    var messaging = $('#conversation .contact.active').attr('user_id');

    if (data.user_send == messaging) {
       $('li.typing').remove();
    }
 })

