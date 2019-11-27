
var me_id = $('#profile-img').attr('user_id');
var caller;
var acceptCall = false;


const peer = new Peer(me_id, {
    key: 'peerjs',
    host: 'peerjs-server-trungquandev.herokuapp.com',
    secure: true,
    port: 443,

    // debug: 3
});
peer.on('open', function () {

});

//Lấy stream từ video và audio


$('#video-call').on('click', function () {
    if (!$('.contact.active').hasClass('groupchat') && $('.contact.active .contact-status').hasClass('online')) {
        var friend_id = $('.contact.active').attr('user_id');
        var friend = getUser(friend_id);
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        getUserMedia({
            audio: true,
            video: true
        }, function (stream) {

            $('#my-video').prop('srcObject', stream);

            var call = peer.call(friend_id, stream);

            call.on('stream', function (stream) {
                $('#their-video').prop('srcObject', stream);
            });
            call.on('close', function () {

                $('#callModal').modal('hide');
                $('#endCall').modal('show');
            });
        }, function (err) { alertify.notify(err.toString()) });

        $('#callModal .profileImg').html(' <img src="' + friend.profile_img + '">');
        $('#callModal .connecting').html('Conneting to ' + friend.firstname + " " + friend.lastname);
        $('#callModal').modal({
            backdrop: 'static'
        });
        socket.emit('video-call', { caller: me_id, listener: friend_id });
    }
});

socket.on('video-call', function (data) {
    var friend = getUser(data.caller);
    caller = data.caller;

    $('#inCallModal .profileImg').html(' <img src="' + friend.profile_img + '">');
    $('#inCallModal .connecting').html(friend.firstname + " " + friend.lastname + ' is calling you');
    $('#inCallModal').modal({
        backdrop: 'static'
    });

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    peer.on('call', function (call) {
        var call = call;
        $('#answer-call').on('click', function () {
            getUserMedia({
                audio: true,
                video: true
            }, function (stream) {
                debugger
                // Hiển thị video bản thân
                // var localStream = stream;
                $('#my-video').prop('srcObject', stream);
                $('#inCallModal').modal('hide');
                $('#callModal').modal({
                    backdrop: 'static'
                });
    
                socket.emit('answer-call', { caller: caller, listener: me_id });
                call.answer(stream);
                call.on('stream', function (stream) {
                    $('#their-video').prop('srcObject', stream);
                });
    
    
                $('#end-call').on('click', function () {
                    call.close();
                })
    
            }, function (err) { alertify.notify(err.toString(), 'error') });
    
        });
    
    })
    $('#callModal .profileImg').html(' <img src="' + friend.profile_img + '">');
    $('#callModal .connecting').html('Conneting to ' + friend.firstname + " " + friend.lastname);

});

socket.on('ready-to-call', function (data) {
    $('#inCallModal').modal('hide');

    $('#callModal').modal({
        backdrop: 'static'
    });


})

socket.on('answer-call', function (data) {
    socket.emit('ready-to-call', data);
})



peer.on('error', function (err) {
    alertify.alert(err.toString())
});

