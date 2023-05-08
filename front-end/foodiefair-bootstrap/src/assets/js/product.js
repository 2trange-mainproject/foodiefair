$(document).ready(function() {
    $('.btn-action').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).find('i').removeClass('bi-bookmark').addClass('bi-bookmark-fill');
        } else {
            $(this).find('i').removeClass('bi-bookmark-fill').addClass('bi-bookmark');
        }
    });
});
