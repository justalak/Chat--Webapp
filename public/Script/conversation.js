$(document).ready(function () {
    loadConversation();
});

function loadConversation(){
    $.ajax({
        type: "GET",
        url: "/getconv",
        dataType: "json",
        success: function (data) {
            debugger
            data.forEach(conv => {
                var name= conv.user.firstname+' '+ conv.user.lastname;
                var conversation='<li class="contact" user_id='+conv.user_id+' conv_id='+conv.conv_id+'>'+
                '<div class="wrap">'+
                    '<span class="contact-status busy"></span>'+
                    '<img src="../Images/default_avt.png" alt="" />'+
                    '<div class="meta">'+
                        '<p class="name">'+name +'</p>'+
                        '<p class="preview"></p>'+
                    '</div>'+
                '</div>'+
            '</li>';
                $('#conversation ul').append(conversation);
            });
        }
    });
}
