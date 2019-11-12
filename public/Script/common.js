window.emojioneVersion = "3.1.2";

var messPerPage=20;
var pageNumber={};
var emoji=$("#type-input").emojioneArea({
    pickerPosition: "top",
    filtersPosition: "bottom",
   container: '#emoji-container',
});
$(document).ready(function () {
  
});
var me=getUser($('#profile-img').attr('user_id'));

$(".messages").animate({ scrollTop: $(document).height() }, "fast");

$("#profile-img").click(function () {
    $("#status-options").toggleClass("active");
});

$(".expand-button").click(function () {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
});




$('#message').click(function(){
    $('#friend-list').hide();
    $('#conversation').show();
})

$('#contacts').click(function(){
    $('#friend-list').show();
    $('#conversation').hide();
})


function getUserID() {
    return $('#profile-img').attr('user_id');
}

function getMessage(conv_id,page) {
    var result;
    $('#loading').show();
    
    $.ajax({
        type: "GET",
        url: "/getmessage/"+conv_id+"/"+page,
        dataType: "json",
        async: false,
        success: function (response) {
           result=response;
           if(response.length<10){
               $('#load-message').hide();
           }
           else  pageNumber[conv_id]+=1;
        }
    });
   $('#loading').hide();
    return result;
}

function getUser(user_id) {
    var result;
    $.ajax({
        type: "GET",
        url: "/getuser/"+user_id,
        dataType: "json",
        async: false,
        success: function (response) {
           result=response;
        },
        error: function(err){
            return err;
        }
    });
    return result;
}