
$(document).ready(function () {
    loadConversation();
    $('li.contact').on('click', contactOnClick);
});

function loadPreview(conv_id) {
    var preview
    $.ajax({
        type: "GET",
        url: "/preview/"+conv_id,
        async:false,
        dataType: "json",
        success: function (response) {
            preview=response;
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
                var preview=loadPreview(conv.conversation.conv_id);
                var previewMessage,sender,marked;
                var time='';
                if(!preview){
                    previewMessage='Send message to '+conv.user.lastname;
                    marked='';
                    sender='';
                }
                else {
                    previewMessage=preview.content;
                    time=calculateTime(preview.sendtime);
                    if(preview.user_send==user_send){
                        sender='You:';
                    }
                    else sender=conv.user.lastname+':';
                    if(preview.seen==1 || preview.user_send==user_send){
                        marked='marked';
                    }
                    else marked='';
                }
                
                if(!preview) preview='Send message to '+conv.user.lastname;
                var name = conv.user.firstname + ' ' + conv.user.lastname;
                var conversation = '<li class="contact" user_id=' + conv.user.user_id + ' conv_id=' + conv.conversation.conv_id + '>' +
                    '<div class="wrap">' +
                        '<span class="contact-status busy"></span>' +
                        '<img src="../Images/default_avt.png" alt="" />' +
                        '<div class="meta">' +
                            '<p class="name">' + name +'</p>' +
                            '<div class="preview-wrap">'+
                                '<p class="preview '+marked+ '"><span class="sender">' + sender + ' </span>'+previewMessage+'</p>' +
                                '<p class="send-time">'+time + '</p>'+
                            '</div>'+
                        '</div>' +
                    '</div>' +
                    '</li>';
                $('#conversation ul').append(conversation);
            });
        }
    });
}


function contactOnClick() {
    $(".message-input input").attr('disabled',false);
    $('.content').removeClass('welcome');
    $('#load-message').show();
    $(".messages").animate({ scrollTop: docHeight+93 }, "fast");
    $(".message-input input").val("");

    if (!$(this).hasClass('active')) {
        $('.contacts .active').removeClass('active');
        $(this).addClass('active');
        $(this).find('.preview').addClass('marked');

        var conv_id = $(this).attr('conv_id');
        var friend_id = $(this).attr('user_id');

        loadMessage(conv_id, friend_id);
        socket.emit('read-message',{conv_id:conv_id,user_send:user_send,user_receive:friend_id});
    }
}

/**
 * Hàm thực hiện load danh sách tin nhắn
 */

function loadMessage(conv_id, friend_id) {
    $('.contact-profile .name').empty();
    $('.messages ul').empty();

    var friend = getUser(friend_id);
    var list = getMessage(conv_id);
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

