$(document).ready(function () {
    var user = new User();
})
class User {
    
    constructor() {
        this.initEvent();
        this.loginFlag=true;
        this.registerFlag=true;
    }
    initEvent() {
        $("#login-btn").click(this.sendUser.bind(this));
        $('#register-btn').click(this.Register.bind(this));
        $('.form-input input').blur(this.blurInput);
    }
    /**
     * Hàm thực hiện gửi thông tin đăng nhập
     */
    sendUser() {
        if (this.checkValid()) {
            var dat = {
                username: $('#username').val(),
                password: $('#password').val()
            }
            var info=dat;
            $.ajax({
                method: 'POST',
                url: '/login',
                data:JSON.stringify(info),
                contentType: 'application/json',
                beforeSend:function(){
                    $('#login-loading').show();
                },
                dataType: 'json',
                success: function (data) {
                    $('#login-loading').hide();
                    if(data['result']===false){
                        $('#alert').show();
                    }
                    else{
                        window.location.href = "/home";
                    }
                },
                error: function (err) {
                    
                    alert(err);
                }
            })
        }
    }
    /**
     * Hàm thực hiện validate thông tin đăng nhập
     */
    checkValid() {
        var flag = true;
        var username = $('#username');
        var password = $('#password');
        if (!username.val()) {
            username.addClass('is-invalid');
            flag = false;
        }
        else {
            username.removeClass('is-invalid');

        }
        if (!password.val()) {
            password.addClass('is-invalid');
            flag = false
        }
        else password.removeClass('is-invalid');
        return flag;
    }
    /**
     * Hàm thực hiện gửi thông tin đăng ký
     */
    Register() {
        var data = {};
        var input = $('.form-input input');
        $.each(input, function (index, item) {
            var fieldName = $(item).attr('fieldName');
            var value = $(item).val();
            if (fieldName != 'confirm')
                data[fieldName] = value;
        });
        var gender = $('#gender').find(':selected').text();
        data['gender']=gender;
        
        if (this.checkRegister() ) {
            $.ajax({
                method: 'POST',
                url: '/register',
                contentType:'application/json',
                dataType: 'json',
                data:  JSON.stringify(data) ,
                beforeSend: function(){
                    $('#register-loading').show();
                    
                },
                success: function (data) {
                    
                    if (!data['result']) {
                        $('.alert-danger.alert-username').show();
                        $('#register-loading').hide();
                    }
                    else {
                        $('.alert-success.alert-username').show();
                        $('#register-loading').hide();
                    }

                },
                error: function (err) {
                    
                    alert(err);
                }
            })
        }
    }
    /**
     * Hàm thực hiện validate dữ liệu đăng ký
     */
    checkRegister() {
        var me=this;
        var input = $('.form-input input');
        var flag = true;
        $.each(input, function (index, item) {
            var fieldName = $(this).attr('fieldName');
            var value = $(this).val();
            if (!value) {
                $(this).removeClass('is-valid');
                $(this).addClass('is-invalid');
                flag = false;
            }
            
            else if (fieldName === 'username' && value.length < 8) {
                $(this).removeClass('is-valid');
                $(this).addClass('is-invalid');
                flag = false;
            }
            else if (fieldName === 'password' && value.length < 6) {
                $(this).removeClass('is-valid');
                $(this).addClass('is-invalid');
                flag = false;
            }
            else if (fieldName === 'confirm' && value != $('.form-input input[fieldName="password"]').val()) {
                $(this).removeClass('is-valid');
                $(this).addClass('is-invalid');
                flag = false;
            }
            else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
                flag = true;
            }
        });
        return flag;
    }

    blurInput() {
        var fieldName = $(this).attr('fieldName');
        var value = $(this).val();
        var flag=true;
        if (!value) {
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
            flag = false;
        }
        else if (fieldName === 'username' && value.length < 8) {
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
            flag = false;
        }
        
        else if (fieldName === 'password' && value.length < 6) {
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
            flag = false;
        }
        else if (fieldName === 'confirm' && value != $('.form-input input[fieldName="password"]').val()) {
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
            flag = false;
        }
        else {
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
            flag = true;
        }
        return flag;
    }
    /**
     * Hàm thực hiện kiểm tra username đăng ký đã tồn tại chưa
     */
    
}