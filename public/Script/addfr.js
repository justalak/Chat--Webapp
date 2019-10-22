$(document).ready(function(){
    loadContact();
})

$('#addcontact').on('click', function () {
    $('#addfrModal .alert').empty();
    $('#addfrModal .alert').hide();
})


$('#addfr-btn').on('click', function () {
    addContact();
    
})

/**
 * Hàm thực hiện thêm contact
 */
function addContact() {
    var name = $('#addfr-input').val();
    $('#addfrModal .alert').empty();
    $('#addfrModal .alert').hide();
    debugger
    if (name) {
        $.ajax({
            method: 'GET',
            url: '/addfr/' + name,
            dataType: 'json',
            success: function (data) {
                var name = data['newuser'].firstname + ' ' + data['newuser'].lastname;
                if (data['result'] === true) {
                    $('#add-before').append('You added ' + name + ' before');
                    $('#add-before').show();
                }
                else if (data['result'] === false) {
                    $('#not-exist').show()
                }
                else {
                    $('#add-success').append('Added ' + name + ' succesfully');
                    loadContact();
                    $('#add-success').show();
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
                debugger
                var contact = '<li class="contact ">' +
                    '<div class="wrap">'+
                '<span class="contact-status busy"></span>'+
                '<img src="../Images/default_avt.png" alt="" />'+
                '<div class="meta">'+
                '<p class="name">' + name + '</p>'+
                '</div>'+
                '</div>'+
                '</li>';
                $('#friend-list ul').append(contact);
            })
        },
        err:function(){

        }
    })
}