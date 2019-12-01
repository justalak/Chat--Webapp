var groupImage = '../../Images/group_image.jpg';


$(document).ready(function () {
    loadConversation();

});
$('#conversation ul ').on('click', 'li.contact', contactOnClick);

$('#chat-single').on('click',()=>{
    loadConversation('single');

    $(".message-input").fadeOut(500);
    $('.content').addClass('welcome');
    $('.contact-profile .name').empty();
    $('.messages ul').empty();
    $('.contact-profile #conversationImg').hide();
    $('#load-message').hide();
});

$('#chat-group').on('click',()=>{
    $(".message-input").fadeOut(500);
    $('.content').addClass('welcome');
    $('.contact-profile .name').empty();
    $('.messages ul').empty();
    $('.contact-profile #conversationImg').hide();
    $('#load-message').hide();

    loadConversation('group');
})

$('#chat-all').on('click',()=>{
    $(".message-input").fadeOut(500);
    $('.content').addClass('welcome');
    $('.contact-profile .name').empty();
    $('.messages ul').empty();
    $('.contact-profile #conversationImg').hide();
    $('#load-message').hide();

    loadConversation();
})

$('#chat-group').on('click',)

function getConversation(conv_id) {
    var result;
    $.ajax({
        type: "GET",
        url: "/getconv/" + conv_id,
        dataType: "json",
        async: false,
        success: function (response) {
            result = response;
        }
    });
    return result;
}

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
function loadConversation(type='all') {
    $('#conversation ul').hide();
    $('#conversation ul').fadeIn(1000);
    $('#conversation ul').empty();
    $.ajax({
        type: "GET",
        url: "/loadconv/"+type,
        async: false,
        dataType: "json",
        success: function (data) {

            data.forEach(conv => {
                var conv_id = conv.conversation.conv_id;
                pageNumber[conv_id] = 1;

                var preview = loadPreview(conv_id);
                var previewMessage, sender, marked, name, image;
                var groupClass;
                var time = '';
                if (!preview) {
                    previewMessage = "You're connected on Messenger"
                    marked = '';
                    sender = '';
                }
                else {
                    if (preview.type != 'text') {
                        previewMessage = 'Sent an attachment';
                    }
                    else {
                        previewMessage = preview.content;
                    }
                    time = calculateTime(preview.sendtime);
                    if (preview.user_send == user_send) {
                        sender = 'You:';
                    }
                    else sender = getUser(preview.user_send).lastname + ':';
                    if (preview.seen == 1 || preview.user_send == user_send) {
                        marked = 'marked';
                    }
                    else marked = '';
                }
                if (conv.friends_id.length <= 1) {
                    var friend = getUser(conv.friends_id[0]);
                    name = friend.firstname + ' ' + friend.lastname;
                    image = friend.profile_img;
                    groupClass = "";
                    var friend_id = friend.user_id;
                }
                else {
                    var number = conv.friends_id.length + 1;
                    name = conv.conversation.name + ' (' + number + ' members)';
                    image = groupImage;
                    groupClass = "groupchat";
                    var friend_id = "";
                }
                var conversation = '<li class="contact ' + groupClass + '" conv_id=' + conv.conversation.conv_id + '>' +
                    '<div class="wrap">' +
                    '<span class="contact-status busy"></span>' +
                    '<img src="' + image + '" alt="" />' +
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
                $("#conversation li[conv_id='" + conv.conversation.conv_id + "']").data('friends_id', conv.friends_id);
                if (conv.friends_id.length <= 1) {
                    $("#conversation li[conv_id='" + conv.conversation.conv_id + "']").attr('user_id', friend_id);
                }
            });
        }
    });

}


function contactOnClick() {
    debugger
    var conv_id = $(this).attr('conv_id');
    if( $(this).data('friends_id')){
        var friends_id=$(this).data('friends_id');
    }

    // var friend = getUser(friend_id);
    var name, conversationImg;
    if (friends_id.length == 1) {
        let friend = getUser(friends_id[0]);
        name = friend.firstname + " " + friend.lastname;
        conversationImg = friend.profile_img;
    }
    else {
        if (conv_id) {
            var conversation = getConversation(conv_id);
        }
        conversationImg = groupImage;
        name = conversation.name;
    }
    $(".message-input").show();
    $('.content').removeClass('welcome');
    $('.contact-profile .name').empty();

    $(".messages").animate({ scrollTop: docHeight + 93 }, "fast");
    $(".message-input input").val("");
    $('.contact-profile .name').append(name);
    $('#conversationImg').attr('src', conversationImg);
    $('#conversationImg').show();

    if (!$(this).hasClass('active')) {
        $('.contacts .active').removeClass('active');
        $('.messages ul').empty();
        $('#load-message').show();
        $(this).addClass('active');
        $(this).find('.preview').addClass('marked');

        pageNumber[conv_id] = 1;

        loadMessage(conv_id, 1);
        $(".messages").animate({ scrollTop: docHeight * 2 + 93 }, "fast");
        $.ajax({
            type: "PUT",
            url: "/read-all-message/"+conv_id,
            dataType: "json",
            data:JSON.stringify({user_send:user_send}),
            success: function (response) {

            }
        });
    }
}

/**
 * Hàm thực hiện load danh sách tin nhắn
 */

function loadMessage(conv_id, page) {

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
        var sendtime = formatDate(new Date(message.sendtime));
        var sender = getUser(message.user_send);
        imgUrl = sender.profile_img;
        var content;

        if (message.type == 'text') {
            content = '<p ' + 'title="' + sendtime + '" >' + message.content + '</p>';
        }
        else if (message.type == 'image') {
            content = '<img src="' + message.filepath + '" class="img-attachment"' + ' title="' + sendtime + '" />';
        }
        else {
            content = '<p><a href="' + message.filepath + '" title="' + sendtime + '" >' + message.content + '</a></p>';
        }
        $('.messages ul').prepend('<li class=' + type + ' message_id='+message.message_id+'>' +
            '<img src="' + imgUrl + '" class="profile-img" />' + content +

            '</li>')
    });
}

