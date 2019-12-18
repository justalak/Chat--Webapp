

window.emojioneVersion = "3.1.2";
const MAX_SIZE = 1024 * 1024 * 2;
alertify.set('notifier','position', 'bottom-right');
var messPerPage = 20;
var pageNumber = {};
var emoji = $("#type-input").emojioneArea({
    pickerPosition: "top",
    filtersPosition: "bottom",
    container: '#emoji-container',
});
var user_send = $('#profile-img').attr('user_id');
var me = getUser($('#profile-img').attr('user_id'));
$(document).ready(function () {
    
    alertify.notify('Welcome to messenger.io, '+me.firstname+" "+me.lastname, 'success', 5);
});

$(".messages").animate({ scrollTop: $(document).height() }, "fast");

$("#profile-img").click(function () {
    $("#status-options").toggleClass("active");
});

$(".expand-button").click(function () {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
});




$('#message').click(function () {
    $('#friend-list').hide();
    $('#conversation').show();
})

$('#contacts').click(function () {
    $('#friend-list').show();
    $('#conversation').hide();
})

$('#file-input').on('change', function () {
    var file = $('#file-input').get(0).files[0];
    if (file.size > MAX_SIZE) {
        $('#fileAlert').modal({
            keyboard: false,
            show:true,
          })
        $('#file-input').val(null);
    }
    else {
        $('#new-file').show();
    }
})

function getUserID() {
    return $('#profile-img').attr('user_id');
}

function getMessage(conv_id, page) {
    
    var result;
    $('#loading').show();

    $.ajax({
        type: "GET",
        url: "/getmessage/" + conv_id + "/" + page,
        dataType: "json",
        async: false,
        success: function (response) {
            result = response;
            if (response.length < 10) {
                $('#load-message').hide();
            }
            else pageNumber[conv_id] += 1;
        }
    });
    $('#loading').hide();
    return result;
}

function getUser(user_id) {
    
    var result;
    $.ajax({
        type: "GET",
        url: "/getuser/" + user_id,
        dataType: "json",
        async: false,
        success: function (response) {
            result = response;
        },
        error: function (err) {
            return err;
        }
    });
    return result;
}

