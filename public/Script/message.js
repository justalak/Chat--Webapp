var user_send = $('#profile-img').attr('user_id');
var docHeight = $(document).height();

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
function addMessage(type, message, conv_id, friend_id) {
    var friend = getUser(friend_id);
    var messaging = $('#conversation .contact.active').attr('conv_id');
    var sender;
    var marked;

    if (messaging == conv_id) {
        var typing=$('li.typing');
        $('<li class=' + type + '><img src="../Images/default_avt.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
        $('.messages ul').append(typing);
        $('.message-input input').val(null);
    }
    
    if(type == 'sent') {
        sender = 'You';
        marked='marked';
    }
    else{
        sender = friend.lastname;
        marked='';
    }
    var conversation = $('.contact[conv_id=' + conv_id + ']');

    $('#conversation ul').prepend(conversation);
    $(conversation).find('.preview').html('<span>' + sender + ': </span>' + message);
    $(conversation).find('.preview').addClass(marked);
    $(conversation).find('.send-time').html('now');
    $(".messages").animate({ scrollTop: docHeight+93 }, "fast");
    docHeight
}

/**
 * Hàm thực hiện gửi tin nhắn
 */
function newMessage() {
    message = $(".message-input input").val();
    if ($.trim(message) == '') {
        return false;
    }

    var user_receive = $('#conversation li.active').attr('user_id');
    var conv_id = $('#conversation li.active').attr('conv_id');
    addMessage('sent', message, conv_id);

    socket.emit('new-message', { user_send: user_send, user_receive: user_receive, conv_id: conv_id, content: message });
};

socket.on('new-message', function (message) {

    addMessage('replies', message.content, message.conv_id,message.user_send);
})

$(".message-input input").on('keypress', function () {
    var user_receive = $('#conversation ul li.active').attr('user_id');
    var conv_id = $('#conversation ul li.active').attr('conv_id');
    socket.emit('typing-on', { user_send: user_send, user_receive: user_receive, conv_id: conv_id });
})



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
            $(".messages").animate({ scrollTop: $(document).height() }, "fast");
        }
    }
})

socket.on('typing-off', (data) => {
    var messaging = $('#conversation .contact.active').attr('user_id');

    if (data.user_send == messaging) {
        $('li.typing').remove();
    }
})
