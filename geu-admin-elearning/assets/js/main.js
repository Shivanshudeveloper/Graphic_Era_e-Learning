$('#coursevideo').change(function() {
    var video = document.getElementById('coursevideo').files[0];
    console.log(typeof video);
    /* $.ajax({
        url: '/courses/upload',
        method: 'post',
        data: video,
        processData: false,
        success: function() {
            console.log("Success");
        },
        error: function(error) {
            console.log(error);
        }
    }); */
});