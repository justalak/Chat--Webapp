

$(document).ready(function () {
    loadContact();
    loadNotification();
})

$('#addContact').on('click', function () {
    $('#addfrModal .alert').empty();
    $('#addfrModal .alert').hide();
})


$('#addfr-btn').on('click', function () {
    addContact();
    loadNotification();

})

$('#notification').on('click', function () {
    if ($('#number-of-notif').text() != 0) {
        $('#notifModal').modal({
            backdrop: 'static'
        });
        checkNotifications();
    }
    else {
        alertify.notify("You don't have any notification", 'error', 7);
    }
})

$('#notifModal .close-notif').on('click', function () {
    loadNotification();
})

/**
 * Hàm thực hiện thêm contact
 */
function addContact() {
    var name = $('#addfr-input').val();
    $('#addfrModal .alert').empty();
    $('#addfrModal .alert').hide();

    if (name) {
        $.ajax({
            method: 'GET',
            url: '/addfr/' + name,
            async: false,
            dataType: 'json',
            success: function (data) {

                if (data.result === true) {
                    var name = data['newuser'].firstname + ' ' + data['newuser'].lastname;

                    $('#add-before').append('You added ' + name + ' before');
                    $('#add-before').show();
                }
                else if (data.result === false) {
                    $('#not-exist').append('Cannot find this user. Please try again.');

                    $('#not-exist').show()
                }
                else {
                    var name = data['newuser'].firstname + ' ' + data['newuser'].lastname;
                    loadContact();
                    loadConversation();

                    socket.emit('add-friend', { user_send: user_send, user_receive: data.newuser.user_id })

                    Swal.fire({
                        title: 'Add contact Successfully',
                        imageUrl: data.newuser.profile_img,
                        imageWidth: 90,
                        imageHeight: 90,
                        text: "You added " + name + " to your contact."
                    })

                }
            },
            error: function (err) {
                alert('error');
            }
        })
        $('#addfr-input').val('');
    }
};

/**
 * Hàm thực hiện cập nhật danh sách contact
 */
function loadContact() {
    $('#friend-list ul').empty();
    $.ajax({
        method: 'GET',
        url: '/getfr',
        dataType: 'json',

        success: function (data) {
            $.each(data, function (index, item) {
                var name = item['firstname'] + ' ' + item['lastname'];
                var user_id = item['user_id'];
                var list=[user_id];
                var profileURL = item.profile_img;
                var li = $('<li class="contact" user_id="' + user_id + '"></li>');

                var contact =
                    '<div class="wrap">' +
                    '<span class="contact-status busy"></span>' +
                    '<img src="' + profileURL + '" alt="" />' +
                    '<div class="meta">' +
                    '<p class="name">' + name + '</p>' +
                    '</div>' +
                    '</div>';
                $(li).append(contact);
                $('#friend-list ul').append(li);
                $("#friend-list li[user_id='" + user_id + "']").data('friends_id',list);
            })
        },
        err: function () {

        }
    })
}

/**
 * Hàm thực hiện load thông báo thêm bạn bè
 */

function loadNotification() {
    var user_id = user_send;
    $('#notifModal .notification-list').empty();
    $.ajax({
        type: "GET",
        url: "/get-notification/" + user_id,
        dataType: "json",
        success: function (response) {
            $('#number-of-notif').html(response.length);
            response.forEach(friend_id => {
                var item = $('<li class="list-group-item "></li>');
                var member = getUser(friend_id);

                $(item).append('<img src="' + member.profile_img + '"/>');
                $(item).append('<p>' + member.firstname + ' ' + member.lastname + " became your friend.</p>");

                $('#notifModal .notification-list').append(item);
            });
        }
    });
}

function checkNotifications(conv_id) {
    var conv_id = user_send;
    $.ajax({
        type: "PUT",
        url: "/check-notifications/" + conv_id,

        dataType: "json",
        success: function (response) {

        }
    });
}

socket.on('add-friend', (data) => {
    loadNotification();
    var friend = getUser(data.user_send);
    alertify.notify(friend.firstname + ' ' + friend.lastname + ' has been added to friends list recently', 'success', 7);
    loadConversation();
    loadContact();
})