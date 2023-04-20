$(document).ready(function() {
    $('.btn-like').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).find('i').removeClass('bi-suit-heart').addClass('bi-suit-heart-fill');
        } else {
            $(this).find('i').removeClass('bi-suit-heart-fill').addClass('bi-suit-heart');
        }
    });

    $('.btn-dib').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).find('i').removeClass('bi-bookmark').addClass('bi-bookmark-fill');
        } else {
            $(this).find('i').removeClass('bi-bookmark-fill').addClass('bi-bookmark');
        }
    });
});