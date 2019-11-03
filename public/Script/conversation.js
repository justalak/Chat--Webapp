$(document).ready(function () {
    loadConversation();
    $('li.contact').on('click', contactOnClick);
});

function loadConversation() {
    $('#conversation ul').empty();
    $.ajax({
        type: "GET",
        url: "/getconv",
        async: false,
        dataType: "json",
        success: function (data) {
            debugger
            data.forEach(conv => {
                var name = conv.user.firstname + ' ' + conv.user.lastname;
                var conversation = '<li class="contact" user_id=' + conv.user.user_id + ' conv_id=' + conv.conv_id + '>' +
                    '<div class="wrap">' +
                    '<span class="contact-status busy"></span>' +
                    '<img src="../Images/default_avt.png" alt="" />' +
                    '<div class="meta">' +
                    '<p class="name">' + name + '</p>' +
                    '<p class="preview"></p>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
                $('#conversation ul').append(conversation);
            });
        }
    });
}

function contactOnClick() {
    $(".message-input input").val("");
    if (!$(this).hasClass('active')) {
        $('.active').removeClass('active');
        $(this).addClass('active');
        var conv_id = $(this).attr('conv_id');
        var friend_id = $(this).attr('user_id');
        debugger
        loadMessage(conv_id, friend_id);
    }
}



function loadMessage(conv_id, friend_id) {
    $('.contact-profile .name').empty();
    $('.messages ul').empty();
    var friend = getUser(friend_id);
    var list = getMessage(conv_id);
    debugger
    var user_id = getUserID();
    $('.contact-profile .name').append(friend.firstname + " " + friend.lastname);
    list.forEach(message => {
        var type;
        if (message.user_send == user_id) {
            type = 'sent'
        }
        else type = 'replies';
        $('.messages ul').append('<li class=' + type + '>' +
            '<img src="../Images/default_avt.png" alt="" />' +
            '<p>' + message.content + '</p>' +
            '</li>')
    });
}

