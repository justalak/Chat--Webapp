
$(document).ready(function () {
    loadConversation();
    $('li.contact').on('click', contactOnClick);
});

function loadPreview(conv_id) {
    var preview
    $.ajax({
        type: "GET",
        url: "/preview/" + conv_id,
        async: false,
        dataType: "json",
        success: function (response) {
            preview = response;
        }
    });
    return preview;
}
/**
 * Hàm thực hiện load danh sách cuộc trò chuyện
 */
function loadConversation() {
    $('#conversation ul').empty();
    $.ajax({
        type: "GET",
        url: "/getconv",
        async: false,
        dataType: "json",
        success: function (data) {

            data.forEach(conv => {
                var conv_id = conv.conversation.conv_id;
                pageNumber[conv_id] = 1;

                var preview = loadPreview(conv_id);
                var previewMessage, sender, marked;
                var time = '';
                if (!preview) {
                    previewMessage = 'Send message to ' + conv.user.lastname;
                    marked = '';
                    sender = '';
                }
                else {
                    if(preview.type!='text'){
                        previewMessage='Sent an attachment';
                    }
                    else{
                        previewMessage = preview.content;
                    }
                    time = calculateTime(preview.sendtime);
                    if (preview.user_send == user_send) {
                        sender = 'You:';
                    }
                    else sender = conv.user.lastname + ':';
                    if (preview.seen == 1 || preview.user_send == user_send) {
                        marked = 'marked';
                    }
                    else marked = '';
                }

                if (!preview) preview = 'Send message to ' + conv.user.lastname;
                var name = conv.user.firstname + ' ' + conv.user.lastname;
                var conversation = '<li class="contact" user_id=' + conv.user.user_id + ' conv_id=' + conv.conversation.conv_id + '>' +
                    '<div class="wrap">' +
                    '<span class="contact-status busy"></span>' +
                    '<img src="' + conv.user.profile_img + '" alt="" />' +
                    '<div class="meta">' +
                    '<p class="name">' + name + '</p>' +
                    '<div class="preview-wrap">' +
                    '<p class="preview ' + marked + '"><span class="sender">' + sender + ' </span>' + previewMessage + '</p>' +
                    '<p class="send-time">' + time + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
                $('#conversation ul').append(conversation);
            });
        }
    });
}


function contactOnClick() {
    var conv_id = $(this).attr('conv_id');
    var friend_id = $(this).attr('user_id');
    var friend = getUser(friend_id);

    $(".message-input").show();
    $('.content').removeClass('welcome');
    $('.contact-profile .name').empty();

    $(".messages").animate({ scrollTop: docHeight + 93 }, "fast");
    $(".message-input input").val("");
    $('.contact-profile .name').append(friend.firstname + " " + friend.lastname);
    $('#friendImg').attr('src', friend.profile_img);

    if (!$(this).hasClass('active')) {
        $('.contacts .active').removeClass('active');
        $('.messages ul').empty();
        $('#load-message').show();
        $(this).addClass('active');
        $(this).find('.preview').addClass('marked');

        pageNumber[conv_id]=1;

        loadMessage(conv_id, friend_id, 1);
         $(".messages").animate({ scrollTop: docHeight * 2 + 93 }, "fast");
        socket.emit('read-message', { conv_id: conv_id, user_send: user_send, user_receive: friend_id });
    }
}

/**
 * Hàm thực hiện load danh sách tin nhắn
 */

function loadMessage(conv_id, friend_id, page) {

    var friend = getUser(friend_id);
    var list = getMessage(conv_id, page);

    var user_id = getUserID();

    list.forEach(message => {
        var type, imgUrl;
        if (message.user_send == user_id) {
            type = 'sent';
        }
        else {
            type = 'replies';
        }

        var sender=getUser(message.user_send);
        imgUrl=sender.profile_img;
        var content;

        if(message.type=='text'){
            content='<p>' + message.content + '</p>';
        }
        else if(message.type=='image'){
            content='<img src="'+message.filepath+'" class="img-attachment" />';
        }
        else{
            content='<p><a href="'+message.filepath+'" title="'+message.content+'" >'+message.content+'</a></p>';
        }
        $('.messages ul').prepend('<li class=' + type + '>' +
            '<img src="' + imgUrl + '" class="profile-img" />' + content+
         
            '</li>')
        
    });
}

