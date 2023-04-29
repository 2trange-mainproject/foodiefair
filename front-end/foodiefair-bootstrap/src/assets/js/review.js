function reviewPageCount() { // 리뷰 더보기 offset 저장해두기 위한 클로저 정의. 일반 리뷰와 인증 리뷰 두개를 사용
    let receipt=0;
    let common=0;

    return {
        inReceipt: function() {
            if(common!=0) common=0;
            receipt+=3
        },
        inCommon: function() {
            if(receipt!=0) receipt=0;
            common+=3;
        },
        init: function() {
            receipt=0;
            common=0;
        },
        commonVal: function() {
            return common;
        },
        receiptVal: function() {
            return receipt;
        }
    }
}
// $(window).on('load', function () {}) html, css 다 업로드 되면 실행 됨 document보다 느림

$(document).ready(function() {
    productInfo();
    $('#product-name').on('click', '.btn-dib', saveTrueFalse); // 찜 토글, 동적으로 페이지가 만들어지는 경우 부모 id를 통해 이벤트 발생 여부 체크
    $('#comment-enroll').click(commentEnroll); // 댓글 등록
    $('.btn-comment-delete').click(commentDelete); // 댓글 삭제
    $('#receipt-review').on('click', '.btn-like', commentLike);// 인증 댓글 좋아요 토글
    $('#common-review').on('click', '.btn-like', commentLike);// 일반 댓글 좋아요 토글

    window.addEventListener('unload', function (){ // 페이지 종료 시 클로저 변수 할당 해제 가비지 컬렉터가 소멸 시켜줌
        window.pageCount=null;
    });

    window.pageCount = reviewPageCount(); // 페이지 DOM 객체 생성시 클로저 변수 생성 (document.read 가 DOM을 만듦)
    $('#review-enroll').click(reviewEnroll); // 리뷰 등록
    $('#receipt-tab').click(receiptReviewRead); // 인증 리뷰 가져오기
    $('#common-tab').click(commonReviewRead); // 일반 리뷰 가져오기
    $('#receipt-more').click(receiptMoreReview); // 인증 리뷰 더보기
    $('#common-more').click(commonMoreReview); // 일반 리뷰 더보기


    $('#receipt-type').change(function (e) { // 인증 리뷰 정렬
        e.stopPropagation();
        $('#receipt-review').html('');
        receiptReviewRead();
        window.pageCount.init();
    });

    $('#common-type').change(function (e) { // 일반 리뷰 정렬
        e.stopPropagation();
        $('#common-review').html('');
        commonReviewRead();
        window.pageCount.init();
    });

    // 인증 리뷰 버튼 클릭 시
    $("#receipt-tab").click(function() {
        // active 클래스를 추가하고, 형제 요소들의 active 클래스를 제거합니다.
        $("#receipt-tab").addClass("active");
        $('#receipt-tab').attr('aria-selected', 'true');
        $('#common-tab').removeClass("active");
        $('#common-tab').attr('aria-selected', 'false');
        $('#receipt-review').html('');
        window.pageCount.init();
    });

    // 일반 리뷰 버튼 클릭 시
    $("#common-tab").click(function() {
        // active 클래스를 추가하고, 형제 요소들의 active 클래스를 제거합니다.
        $('#common-tab').addClass("active");
        $('#common-tab').attr('aria-selected', 'true');
        $('#receipt-tab').removeClass("active");
        $('#receipt-tab').attr('aria-selected', 'false');
        $('#common-review').html('');
        window.pageCount.init();
    });
});

function commonMoreReview(e) {
    e.preventDefault();
    window.pageCount.inCommon();
    console.log(window.pageCount.commonVal())
    commonReviewRead();
}

function receiptMoreReview(e) {
    e.preventDefault();
    window.pageCount.inReceipt();
    console.log(window.pageCount.receiptVal())
    receiptReviewRead();
}

function productInfo() { // 페이지 들어오면 실행, 실제로는 변경 될 듯? 다른 페이지에서 productId를 GET으로 보내줄 거임
    //window.pageCount.init(); // 페이지 load시 생성, unload시 해제 인데 제대로 동작하면 init() 함수 제거.
    let productId='AA0001';
    $.ajax({
        url:'http://localhost:8081/products/'+productId,
        type:'GET',
        success: function (data) {
            console.log(data);
            var text=data.productName+'<a href="#" class="ms-2 btn-dib" style="color: deeppink">'+'<i class="bi bi-bookmark"></i></a>';
            $('#product-name').html(text);
            text='(리뷰 개수 '+data.productReviews+')';
            $('#product-review').text(text);
            text='(찜 개수 '+data.productSaved+')';
            $('#product-saved').text(text);
            text=data.productPrice.toLocaleString('ko-KR')+'원';
            $('#product-price').text(text);
            text=JSON.parse(data.fixedTag);
            $('#product-store').text(text.store);
            $('#product-category').text(text.bigCate+' '+text.smallCate);
            text=data.productFestival;
            if(text==1)
                $('#product-event').text('X');
            else if(text==2)
                $('#product-event').text('#1+1');
            else if(text==3)
                $('#product-event').text('#2+1');
            receiptReviewRead();
        },
        error: function(data) {
            console.log(data)
        }
    });
}

function receiptReviewRead() { // 인증 리뷰
    var data = {
        productId:'AA0001',
        offset:window.pageCount.receiptVal(),
        receiptImg:1,
        sort:$('#receipt-type').val()
    }
    var query = $.param(data);
    $.ajax({
        url:'http://localhost:8081/products/review?'+query,
        type:'GET',
        success: function (data) {
            console.log(data);
            $.each(data, function(index, item) {
                var text =
                    `<div class="d-flex">
                      <a href="#" target="_self" class="rounded-circle avatar-lg">
                        <img id="review-profile" src="../assets/images/avatar/avatar-10.jpg" alt="" class="rounded-circle avatar-lg">
                      </a>
                      <div class="ms-5">
                        <div id="review-name">
                          <h6 class="mb-1">
                            ${item.userName}
                            <a href="#" class="text-muted ms-3"><i class="bi bi-trash me-1"></i>삭제하기</a>
                            <a href="#" class="text-muted ms-3"><i class="bi bi-pencil me-1"></i>수정하기</a>
                          </h6>
                        </div>
                        <p class="small"> <span class="text-muted">${item.reviewDate}</span>
                          <span class="text-primary ms-3 fw-bold">인증 완료</span></p>
                        <div class=" mb-2">
                          <span class="text-dark fw-bold">${item.reviewTitle}</span>
                        </div>
                        <p>좋았던 점: ${item.goodReviews}</p>
                        <p>아쉬운 점: ${item.badReviews}</p>
                        <div>
                          <div class="border icon-shape icon-lg border-2 ">
                            <!-- img --><img src="../assets/images/products/product-img-1.jpg" alt=""
                                             class="img-fluid ">
                          </div>
                          <div class="border icon-shape icon-lg border-2 ms-1 ">
                            <!-- img --><img src="../assets/images/products/product-img-2.jpg" alt=""
                                             class="img-fluid ">
                          </div>
                          <div class="border icon-shape icon-lg border-2 ms-1 ">
                            <!-- img --><img src="../assets/images/products/product-img-3.jpg" alt=""
                                             class="img-fluid ">
                          </div>
                        </div>
                      </div>
                    </div>
                        <!-- icon -->
                        <div class="d-flex justify-content-end mt-4 pb-6">
  <!--                        <a href="#" class="text-muted"><i class="bi bi-chat-left-text me-1"></i>더보기</a>-->
                          <div class="mx-4">
                            <a href="#" class="text-muted" data-bs-toggle="collapse" data-bs-target="#${item.reviewId}"><i class="bi bi-chat-dots me-1"></i>댓글
                              <span class="translate-middle-y badge rounded-pill bg-pink-300">${item.commentNum}</span>
                            </a>
                          </div>
                          <div>
                            <a href="#" class="text-muted btn-like"><i class="bi bi-suit-heart me-1"></i>Like
                              <span class="translate-middle-y badge rounded-pill bg-white text-muted">${item.reviewLikes}</span>
                            </a>
                          </div>
                        </div>
                        <div class="collapse ms-15 pb-6 mb-6" id="${item.reviewId}">
                          <div class="border-bottom pb-4 mb-4">
                            <h6>
                              Shankar Subbaraman<a href="#" class="text-muted ms-3 btn-comment-delete"><i class="bi bi-trash me-1"></i>삭제하기</a>
                            </h6>
                            <div>
                              <p class="text-dark mb-1">무게 주작 함</p>
                            </div>
                            <div class="small text-muted">30 December 2022</div>
                          </div>
                          <div class="row g-3">
                            <div class="col-sm-11">
                              <input type="text" id="comment" class="form-control" placeholder="댓글을 작성해주세요.">
                            </div>
                            <div class="col-sm">
                              <button type="button" id="comment-enroll" class="btn btn-outline-secondary form-control-sm"><i class="bi bi-check2"></i></button>
                            </div>
                          </div>
                        </div>`;

                if(window.pageCount.receiptVal()==0 && $('#receipt-review').children().length == 9) {
                    $('#receipt-review').html('');
                }

                $('#receipt-review').append(text);
            });
        },
        error: function (error) {
            console.log(error)
        }
    });
}

function reviewEnroll(e) { // 리뷰 등록
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

function commonReviewRead() { // 일반 리뷰
    var data = {
        productId:'AA0001',
        offset:window.pageCount.commonVal(),
        receiptImg:0,
        sort:$('#common-type').val()
    }
    var query = $.param(data);
    $.ajax({
        url:'http://localhost:8081/products/review?'+query,
        type:'GET',
        success: function (data) {
            console.log(data);
            $.each(data, function(index, item) {
                var text =
                    `<div class="d-flex">
                      <a href="#" target="_self" class="rounded-circle avatar-lg">
                        <img src="../assets/images/avatar/avatar-8.jpg" alt="" class="rounded-circle avatar-lg">
                      </a>
                      <div class="ms-5">
                        <div id="review-name">
                          <h6 class="mb-1">
                            ${item.userName}
                            <a href="#" class="text-muted ms-3"><i class="bi bi-trash me-1"></i>삭제하기</a>
                            <a href="#" class="text-muted ms-3"><i class="bi bi-pencil me-1"></i>수정하기</a>
                          </h6>
                        </div>
                        <p class="small"> <span class="text-muted">${item.reviewDate}</span>
                          <span class="text-danger ms-3 fw-bold">미인증</span></p>
                        <div class=" mb-2">
                          <span class="text-dark fw-bold">${item.reviewTitle}</span>
                        </div>
                        <p>좋았던 점: ${item.goodReviews}</p>
                        <p>아쉬운 점: ${item.badReviews}</p>
<!--    이미지 영역           <div>-->
<!--                          <div class="border icon-shape icon-lg border-2 ">-->
<!--                          </div>-->
<!--                          <div class="border icon-shape icon-lg border-2 ms-1 ">-->
<!--                          </div>-->
<!--                          <div class="border icon-shape icon-lg border-2 ms-1 ">-->
<!--                          </div>-->
<!--                        </div>-->
                      </div>
                    </div>
                        <!-- icon -->
                        <div class="d-flex justify-content-end mt-4 pb-6">
  <!--                        <a href="#" class="text-muted"><i class="bi bi-chat-left-text me-1"></i>더보기</a>-->
                          <div class="mx-4">
                            <a href="#" class="text-muted" data-bs-toggle="collapse" data-bs-target="#${item.reviewId}"><i class="bi bi-chat-dots me-1"></i>댓글
                              <span class="translate-middle-y badge rounded-pill bg-pink-300">${item.commentNum}</span>
                            </a>
                          </div>
                          <div>
                            <a href="#" class="text-muted btn-like"><i class="bi bi-suit-heart me-1"></i>Like
                              <span class="translate-middle-y badge rounded-pill bg-white text-muted">${item.reviewLikes}</span>
                            </a>
                          </div>
                        </div>
                        <div class="collapse ms-15 pb-6 mb-6" id="${item.reviewId}">
                          <div class="border-bottom pb-4 mb-4">
                            <h6>
                              Shankar Subbaraman<a href="#" class="text-muted ms-3 btn-comment-delete"><i class="bi bi-trash me-1"></i>삭제하기</a>
                            </h6>
                            <div>
                              <p class="text-dark mb-1">무게 주작 함</p>
                            </div>
                            <div class="small text-muted">30 December 2022</div>
                          </div>
                          <div class="row g-3">
                            <div class="col-sm-11">
                              <input type="text" id="comment" class="form-control" placeholder="댓글을 작성해주세요.">
                            </div>
                            <div class="col-sm">
                              <button type="button" id="comment-enroll" class="btn btn-outline-secondary form-control-sm"><i class="bi bi-check2"></i></button>
                            </div>
                          </div>
                        </div>`;

                if(window.pageCount.commonVal()==0 && $('#common-review').children().length == 9) {
                    $('#common-review').html('');
                }
                console.log("append")
                $('#common-review').append(text);
            });
        },
        error: function (error) {
            console.log(error)
        }
    });
}

// 리뷰 기능 끝

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
    let eventButton = e.target;

    $(this).toggleClass('active');
    if ($(this).hasClass('active')) {
        $(this).find('i').removeClass('bi-suit-heart').addClass('bi-suit-heart-fill');
        likeReviewInsert(eventButton);
    } else {
        $(this).find('i').removeClass('bi-suit-heart-fill').addClass('bi-suit-heart');
        likeReviewDelete(eventButton);
    }
};

function likeReviewInsert(event) { // 리뷰 좋아요 등록
    let data = {
        userId:2,
        reviewId: Number(event.parentNode.parentNode.parentNode.nextElementSibling.id)
    }
    console.log(JSON.stringify(data));
    $.ajax({
        url:'http://localhost:8081/products/review/likeReview',
        type: 'POST',
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

function likeReviewDelete(event) { // 리뷰 좋아요 삭제
    let userId=2;
    let reviewId=Number(event.parentNode.parentNode.parentNode.nextElementSibling.id);
    $.ajax({
        url:'http://localhost:8081/products/review/likeReviewDelete/'+userId+"/"+reviewId,
        type: 'DELETE',
        success: function (data) {
            console.log(data);
        },
        error: function(data) {
            console.log(data)
        }
    });
}

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
}

function save() { // 찜 등록
    var data = {
        userId:20,
        productId:'AA0001'
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
        userId:20,
        productId:'AA0001'
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