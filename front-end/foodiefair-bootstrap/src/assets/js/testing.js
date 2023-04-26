function reviewPageCount() { // 리뷰 더보기를 저장해두기 위함 클로저 일반 리뷰와 인증 리뷰 두개를 사용
    let receipt=0;
    let common=0;

    return {
        receipt: function() {
            if(common!=0) common=0;
            ++receipt;
            return receipt;
        },
        common: function() {
            if(receipt!=0) receipt=0;
            ++common;
            return common;
        }
    }
}

$(document).ready(function() {
    $('#comment-enroll').click(commentEnroll); // 댓글 등록
    $('.btn-comment-delete').click(commentDelete); // 댓글 삭제
    $('.btn-dib').click(saveTrueFalse); // 찜 토글
    $('.btn-like').click(commentLike); // 댓글 좋아요 토글
    $('#review-enroll').click(reviewEnroll); // 리뷰 등록
});

function reviewEnroll(e) {
    e.preventDefault();
    var data = {
        userId:9,
        productId:'AA0001',
        reviewLikes:8,
        receiptImg:0,
        reviewImg:'아직 몰라요',
        reviewTitle:$('#review-title').val(), //실제로 얘만 있어야 함
        goodReviews:$('#good-review').val(), //실제로 얘만 있어야 함
        badReviews:$('#bad-review').val() //실제로 얘만 있어야 함
    }
    $.ajax({
        url:'http://localhost:8081/products/review',
        type:'post',
        contentType:'application/json',
        data:JSON.stringify(data),
        success: function (data) {
            console.log(data);
            $('#review-title').val('');
            $('#good-review').val('');
            $('#bad-review').val('');
        },
        error: function(data) {
            console.log(data)
        }
    });
};

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