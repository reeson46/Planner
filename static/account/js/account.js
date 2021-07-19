$(document).ready(function(){

    var password_input = $('#profile-password');
    var profile_save_btn = $('#profile-save-btn');

    // Disable save button if password field is empty
    if(profile_save_btn.val() != ''){
        password_input.removeClass('required-field')
        profile_save_btn.attr('disabled', false)
    }else{
        password_input.addClass('required-field')
        profile_save_btn.attr('disabled', true)
    }

    // Check if something had been input into password field
    password_input.on('keyup', function(){
        password_input.removeClass('required-field')
        profile_save_btn.attr('disabled', false)
    })
})