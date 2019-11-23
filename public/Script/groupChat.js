var memberList = [];
var me_id = $('#profile-img').attr('user_id');
var newMembers = [];

$('#add-groupchat').on('click', function () {
    $('#groupchatModal ul').empty();
    $('#groupchatModal .alert').hide();
    $('#friend-input').removeClass('is-invalid');
    $('#groupname-input').removeClass('is-invalid');
    $('#groupname-input').val("");
    memberList = [];
})



$('#groupchatModal #addToGroup-btn').on('click', function () {
    addToGroup();
})

$('#add-members').on('click', function () {
    $('#addMembers ul').empty();
    $('#addMembers .alert').hide();
    $('.friend-input').removeClass('is-invalid');
    $('#addMembers').modal('show');
    newMembers = [];
})

$('#addMembers .addNewMember-btn').on('click', function () {

    addNewMember()
})

$('#create-group-btn').on('click', function () {
    createGroup();
})

$('#groupname-input').on('blur', function () {
    if ($(this).val()) {
        $(this).removeClass('is-invalid');
    }
});



$('#save-newname').on('click', function () {
    updateGroupChat();
})
 $('#add-new-members').on('click',function () {
     updateGroupMembers();
   })
$(document).on('click', '#conversation-infor', function () {
    getConversationInfor();
})
/**
 * Hàm thực hiện lấy thông tin người dùng qua username
 * @param {username} username 
 */
function getUserInfor(username) {
    var result;
    $.ajax({
        type: "GET",
        url: "/getinfor/" + username,
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
/**
 * Hàm thực hiện thêm member vào group chat
 */
function addToGroup() {

    var name = $('#friend-input').val();
    var friend = getUserInfor(name);

    if (friend) {
        var isPushed = memberList.some((element, index, arr) => {
            return element == friend.user_id;
        });
        if (!isPushed && friend.user_id != me_id) {
            memberList.push(friend.user_id);
            var item = $('<li class="list-group-item "></li>');
            $(item).append('<img src="' + friend.profile_img + '"/>');
            $(item).append('<p>' + friend.firstname + ' ' + friend.lastname + '</p>')
            $('#groupchatModal .modal-body ul').append(item);
            $('#friend-input').removeClass('is-invalid');

        }
        else {
            $('#friend-input').addClass('is-invalid')
        }
    }
    else $('#friend-input').addClass('is-invalid');
    $('#friend-input').val("");
}

/**
 * Hàm thực hiện tạo nhóm chat mới
 */
function createGroup() {
    $('#groupchatModal .modal-body .alert-danger').hide();
    var groupName = $('#groupname-input').val();
    if (!groupName) {
        $('#groupname-input').addClass('is-invalid');
    }
    else if (memberList.length < 2) {
        $('#groupchatModal .modal-body').prepend('<div class="alert alert-danger" role="alert">' +
            'Group contains at least 3 members' +
            '</div>');
    }
    else {
        $.ajax({
            type: "POST",
            url: "/creategroup",
            data: JSON.stringify({ memberList: memberList, groupName: groupName, userHost: me_id }),
            async: false,
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {
                $('#groupchatModal').modal('hide');
                loadConversation();
            }
        });
    }
}
/**
 * Hàm thực hiện lấy thông tin cuộc trò chuyện
 */
function getConversationInfor() {
    $('#groupchatInfor .modal-body ul').empty();

    var messaging = $('#conversation .contact.active');

    if ($(messaging).hasClass('groupchat')) {
        var conv_id = $(messaging).attr('conv_id');
        var conversation = getConversation(conv_id);
        var listMember = $(messaging).data('friends_id');
        var me_id = user_send;
        var item = $('<li class="list-group-item "></li>');

        var me = getUser(me_id);
        $(item).append('<img src="' + me.profile_img + '"/>');
        $(item).append('<p>' + me.firstname + ' ' + me.lastname + ' (me)' + '</p>');
        $('#groupchatInfor .modal-body ul').append(item);
        $('#groupchatInfor .groupname-input').val(conversation.name);
        $('#groupchatInfor .groupname-input')
        listMember.forEach(element => {
            var item = $('<li class="list-group-item "></li>');
            var member = getUser(element);
            $(item).append('<img src="' + member.profile_img + '"/>');
            $(item).append('<p>' + member.firstname + ' ' + member.lastname + '</p>');
            $('#groupchatInfor .modal-body ul').append(item);
        });
        $('#groupchatInfor').modal('show');
    }
}
/**
 * Hàm thực hiện thay đổi tên nhóm chat
 */
function updateGroupChat() {
    var messaging = $('#conversation .contact.active');
    var conv_id = $(messaging).attr('conv_id');
    var conversation = getConversation(conv_id);
    var newname = $('#groupchatInfor .groupname-input').val();

    if (newname != conversation.name) {
        $.ajax({
            type: "PUT",
            url: "/update-group-name/" + conv_id,
            data: JSON.stringify({ newname: newname }),
            contentType: "application/json",
            async: false,
            success: function (response) {
                $('#groupchatInfor').modal('hide');
                loadConversation(); $('#conversation .contact.active')
                $('.contact-profile .name').html(newname);
                $('#conversation .contact[conv_id="' + conv_id + '"]').addClass('active');
            }
        });
    }
}
/**
 * Hàm thực hiện nhập thành viên mới vào Group
 */
function addNewMember() {

    var list = $('#conversation .contact.active').data('friends_id');
    var name = $('#addMembers .friend-input').val();
    var conv_id = $('#conversation .contact.active').attr('conv_id');
    var friend = getUserInfor(name);
    var me_id = user_send;
    debugger
    if (friend) {
        var isPushed = newMembers.some((element, index, arr) => {
            return element == friend.user_id;
        });

        var isInGroup = list.some((element, index, arr) => {
            return element == friend.user_id;
        });
        if (!isPushed && friend.user_id != me_id && !isInGroup) {
            newMembers.push(friend.user_id);
            debugger
            var item = $('<li class="list-group-item "></li>');

            $(item).append('<img src="' + friend.profile_img + '"/>');
            $(item).append('<p>' + friend.firstname + ' ' + friend.lastname + '</p>')
            $('#addMembers .modal-body ul').append(item);
            $('#addMembers .friend-input').removeClass('is-invalid');

            // $.ajax({
            //     type: "POST",
            //     url: "/add-members/" + conv_id,
            //     data: JSON.stringify({ newMembers: newMembers }),
            //     async: false,
            //     dataType: "json",
            //     contentType: 'application/json',
            //     success: function (result) {
            //         $('#addMembers').modal('hide');
            //         debugger
            //         loadConversation();
            //     }
            // });
        }
        else {
            $('#addMembers .friend-input').addClass('is-invalid')
        }
    }
    else $('#addMembers .friend-input').addClass('is-invalid');
    $('#addMembers .friend-input').val("");
}

function updateGroupMembers() {

    var conv_id = $('#conversation .contact.active').attr('conv_id');
    if (newMembers.length < 1) {
        $('#addMembers .friend-input').addClass('is-invalid');
    }
    else {
        $.ajax({
            type: "POST",
            url: "/add-members/" + conv_id,
            data: JSON.stringify({ newMembers: newMembers }),
            async: false,
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {
                $('#addMembers').modal('hide');
                debugger
                loadConversation();
            }
        });
    }
}