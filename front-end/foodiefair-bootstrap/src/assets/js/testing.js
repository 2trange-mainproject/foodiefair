$(document).ready(function() {
    $("#comment-enroll").click(enroll);

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
            save();
        } else {
            $(this).find('i').removeClass('bi-bookmark-fill').addClass('bi-bookmark');
            savedToDelete();
        }
    });
});

function enroll() {
    var data = {
        //commentId:1, auto increment 때문에 필요 없음.
        writerId:'sui',
        reviewerId:'messi',
        comment:$('#comment').val()
    }
    $.ajax({
        url:'http://localhost:8081/products/comment',
        type:'post',
        contentType:'application/json',
        data:JSON.stringify(data),
        success: function (data) {
            console.log(data); //성공시 댓글 추가 된 페이지 띄워주는 거 추가 해야 함.
        },
        error: function(data) {
            console.log(data)
        }
    });
};

function save() {
    var data = {
        userId:'userid',
        productId:'AABBCC11'
    }
    $.ajax({
        url:'http://localhost:8081/products/save',
        type:'post',
        contentType:'application/json',
        data:JSON.stringify(data),
        success: function (data) {
            console.log(data);
        },
        error: function(data) {
            console.log(data)
        }
    });
}

function savedToDelete() {
    var data = {
        userId:'userid',
        productId:'AABBCC11'
    }
    $.ajax({
        url:'http://localhost:8081/products/savedToDelete',
        type:'post',
        contentType:'application/json',
        data:JSON.stringify(data),
        success: function (data) {
            console.log(data);
        },
        error: function(data) {
            console.log(data)
        }
    });
}