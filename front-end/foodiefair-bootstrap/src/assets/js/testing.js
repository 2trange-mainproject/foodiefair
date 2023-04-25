$(document).ready(function() {
    $("#comment-enroll").click(commentEnroll); // 댓글 등록
    $('.btn-comment-delete').click(commentDelete); // 댓글 삭제
    $('.btn-dib').click(saveTrueFalse); // 찜 토글
    $('.btn-like').click(commentLike); // 댓글 좋아요 토글
});

function commentEnroll() { // 댓글 등록
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

function commentDelete(e) { // 댓글 삭제
    e.preventDefault();
    var data = 22;
    $.ajax({
        url:'http://localhost:8081/products/commentDelete/'+data,
        type:'delete',
        contentType:'application/json',
        success: function (data) {
            console.log(data);
        },
        error: function(data) {
            console.log(data)
        }
    });
};

function commentLike(e) { // 댓글 좋아요 토글
    e.preventDefault();
    $(this).toggleClass('active');
    if ($(this).hasClass('active')) {
        $(this).find('i').removeClass('bi-suit-heart').addClass('bi-suit-heart-fill');
    } else {
        $(this).find('i').removeClass('bi-suit-heart-fill').addClass('bi-suit-heart');
    }
};


function saveTrueFalse(e) { // 찜 토글
    e.preventDefault();
    $(this).toggleClass('active');
    if ($(this).hasClass('active')) {
        $(this).find('i').removeClass('bi-bookmark').addClass('bi-bookmark-fill');
        save();
    } else {
        $(this).find('i').removeClass('bi-bookmark-fill').addClass('bi-bookmark');
        savedToDelete();
    }
};


function save() { // 찜 등록
    var data = {
        userId:22,
        productId:'AABBCC11'
    }
    $.ajax({
        url:'http://localhost:8081/products/save/',
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
};

function savedToDelete() { // 찜 삭제
    var data = {
        userId:22,
        productId:'AABBCC11'
    }
    $.ajax({
        url:'http://localhost:8081/products/save/savedToDelete',
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
};

function saveCount() {
    var data="CA0010";
    $.ajax({
        url:'http://localhost:8081/products/save/count/'+data,
        type:'get',
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