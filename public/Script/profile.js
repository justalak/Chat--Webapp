$(document).ready(function () {
    $('#profile-img').attr('src', me.profile_img);
    $('#imgProfile').attr('src', me.profile_img);
});


$imgSrc = $('#imgProfile').attr('src');
function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imgProfile').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
$('#btnChangePicture').on('click', function () {
    // document.getElementById('profilePicture').click();
    if (!$('#btnChangePicture').hasClass('changing')) {
        $('#profilePicture').click();
    }
    else {
        // change
    }
});
$('#profilePicture').on('change', function () {
    readURL(this);
    $('#btnChangePicture').addClass('changing');
    $('#btnChangePicture').attr('value', 'Confirm');
    $('#btnDiscard').removeClass('d-none');
    // $('#imgProfile').attr('src', '');
});
$('#btnDiscard').on('click', function () {
    // if ($('#btnDiscard').hasClass('d-none')) {
    $('#btnChangePicture').removeClass('changing');
    $('#btnChangePicture').attr('value', 'Change');
    $('#btnDiscard').addClass('d-none');
    $('#imgProfile').attr('src', $imgSrc);
    $('#profilePicture').val('');
    // }
});


$('#profile-img').on('click', function () {
    $('#profile-modal').modal({
        keyboard: false,
        show: true,
        backdrop: 'static'
    })

})

$('#profileSetting').on('click', function () {
    $('#profile-modal').modal({
        keyboard: false,
        show: true,
        backdrop: 'static'
    })

})

$('#saveInfo').on('click', function () {
    var files = $('#profilePicture').get(0).files;
    var formData = new FormData();
    var file = files[0];
    formData.append('file', file, file.name);
    if (file.size > FILE_LIMIT) {
        alertify.error('File that you choose is too big. Max size available is 2MB', 'error', 7);
    }
    else {
        $.ajax({
            type: "POST",
            url: "/upload",
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () {
                $('#profile-modal .waiting').show();
            },
            dataType: 'json',
            success: function (response) {
                var imgUrl = response;
                $('#profile-img').attr("src", imgUrl);
                debugger
                $('#profile-modal .waiting').hide();
                Swal.fire({
                    icon: 'success',
                    title: 'Update Successfully',
                    text: "Your profile image has been updated successfully."
                })
                debugger

                $('#profile-modal').modal('hide');

            }
        });
    }
})