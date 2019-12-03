
var me_id = $('#profile-img').attr('user_id');
var socket = io();
socket.emit('connected', { user_id: me_id });
socket.emit('check-status');
var onlineList = [];

socket.on('online-list', function (listid) {
    onlineList = listid;
    updateStatusUser();
})

/**
 * Hàm thực hiện cập nhật danh sách online
 */
function updateStatusUser() {

    $('.contact').find('.contact-status').removeClass('online');
    $('.contact').find('.contact-status').addClass('busy');

    var list = $('.contact');

   for(var i=0;i<onlineList.length;i++){
        $.each(list, (index, item) => {
            var id=parseInt(onlineList[i]);
            var members = $(item).data('friends_id');
            
            if (members.indexOf(id) != -1) {
                var friend = $(item).find('.contact-status');
                $(friend).removeClass('busy');
                $(friend).addClass('online');
            }
        })
    }
}

socket.on('user-online', function (user_id) {
    
    if (onlineList.indexOf(user_id) == -1) {
        onlineList.push(user_id);
    }
    
    updateStatusUser();
})
socket.on('user-offline', function (user_id) {
    if (onlineList.indexOf(user_id) != -1) {
        onlineList.splice(onlineList.indexOf(user_id), 1);
    }
    updateStatusUser();
})





