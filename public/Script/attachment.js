/**
 * Hàm hiển thị file lên giao diện chat 
 */
function displayAttachment(type, file,filename, conv_id, user_id) {
    var send = getUser(user_id);
    var imgUrl = send.profile_img;
    var messaging = $('#conversation .contact.active').attr('conv_id');
    var conversation = getConversation(conv_id);
    var sender, imgUrl;
    if (type == 'sent') {
        
        sender = 'You';
    }
    else {
        
        sender = send.lastname;
        if (messaging != conv_id)
            if (conversation.name)
                alertify.notify(send.firstname + " " + send.lastname + " sent an attachment to " + conversation.name, 'success', 7);
            else
                alertify.notify(send.firstname + " " + send.lastname + " sent an attachment", 'success', 7);

    }

    if (messaging == conv_id) {
        if (file.filetype == 'image') {
            content = '<img src="' + file.filepath + '" class="img-attachment" />';

        }
        else {
            content = '<p><a href="' + file.filepath + '" title="' + filename + '" >' + filename + '</a></p>';
        }

        $('.messages ul').append('<li class="' + type + '">' +
            '<img src="' + imgUrl + '" class="profile-img" />' + content +
            '</li>');

    }

    var conversation = $('.contact[conv_id=' + conv_id + ']');

    $('#conversation ul').prepend(conversation);
    $(conversation).find('.preview').html('<span>' + sender + ': </span>Sent an attachment');

    if (type == 'sent') {
        $(conversation).find('.preview').addClass('marked');
    }
    else {
        $(conversation).find('.preview').removeClass('marked');
    }

    $(conversation).find('.send-time').html('now');
    $(".messages").animate({ scrollTop: docHeight + 700 }, "fast");
    docHeight += 700;
}

function sendAttachment(files, conv_id, user_receive) {
    var file = files[0];
    if (file.size > FILE_LIMIT) {
        alertify.error('File that you choose is too big. Max size available is 2MB', 'error', 7);
    }
    var formData = new FormData();

    var type;
    if (file.type.substring(0, 5) == 'image') {
        type = 'image';
    }
    else type = 'file';

    formData.append('file', file, file.name);

    $.ajax({
        type: "POST",
        url: "/sendattachment/" + conv_id + "/" + user_send,
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            socket.emit('new-file', { file: response,filename:file.name, user_send: user_send, user_receive: user_receive, conv_id: conv_id });
            displayAttachment('sent', response,file.name, conv_id, me_id);
        },
        err: function (err) {

        }
    });
}

socket.on('new-file', (data) => {
    
    displayAttachment('replies', data.file,data.filename, data.conv_id, data.user_send);
    if ($('#conversation .contact.active').attr('conv_id') == message.conv_id) {
        var friend_id = data.user_send;
        socket.emit('read-message', { conv_id: message.conv_id, user_send: user_send, user_receive: friend_id });
    }
})

