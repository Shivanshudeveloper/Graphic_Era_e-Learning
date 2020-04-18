/* $('#registrationfee').on('input', function() {
    var val = parseInt($('#registrationfee').val());
    var val1 = parseInt($('#tuitionfee').val());
    var total;
    console.log(val);
    if(val == NaN) {
        if(val1 == NaN) {
            val = val1 = 0;
            total = 0;
        }
        else {
            val1 = 0;
            total = val + val1;
        }
    }
    else {
        if(val1 == NaN) {
            val1 = 0;
            total = 0;
        }
        else {
            total = val + val1;
        }
    }
    $('#totalfee').val(total);
});

$('#tuitionfee').on('input', function() {
    var val = parseInt($('#registrationfee').val());
    var val1 = parseInt($('#tuitionfee').val());
    var total;
    console.log(val);
    if(val == NaN) {
        if(val1 == NaN) {
            val = val1 = 0;
            total = 0;
        }
        else {
            val = 0;
            total = val + val1;
        }
    }
    else {
        if(val1 < 1) {
            val1 = 0;
            total = val + val1;
        }
        else {
            total = val + val1;
        }
    }
    $('#totalfee').val(total);
}); */

var switchStatus = false;
$('#introductoryvideo').on("change", function() {
    var value = $('input[type="checkbox"]:checked').val();
    if ($(this).is(':checked')) {
        switchStatus = $(this).is(':checked');
    }
    else {
       switchStatus = $(this).is(':checked');
    }
    $('#introductoryvideo').val(switchStatus, 'value');
    $('#introductory').val(switchStatus);
});

$('#generatepassword').click(function() {
    var text = "";
    var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for(var i=0; i < 10; i++ )
    {  
    text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    $('#password').val(text);
});

$('#course').change(function() {
    var value = $(this).val();
    var code;
    if(value == 'Bachelor of Business Administration') {
        code = '<option value="subject" selected disabled>Subject</option><option value="Principles of Management">Principles of Management</option>';
    }
    else if(value == 'Bachelor of Commerce') {
        code = '<option value="subject" selected disabled>Subject</option><option value="Accountancy">Accountancy</option>';
    }
    else if(value == 'Bachelor of Computer Applications') {
        code = '<option value="subject" selected disabled>Subject</option><option value="System Analysis & Design">System Analysis & Design</option>';
    }

    $('#subject option').remove();
    $('#subject').append(code);
});