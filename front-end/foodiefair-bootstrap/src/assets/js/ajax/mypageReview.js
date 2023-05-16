function getUserIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userId");
}

$(document).ready(function (){
    $(window).on('unload', function (){ // 페이지 이동시 null로 바꿔줌으로써 가비지 컬렉터가 수거
        pageOffset = null;
    });

    $('.btn-reviews').click(productReviewTab) // 리뷰 탭 이동시 html 초기화 및 해당 탭  리뷰 목록 가져오기
    $('#select-review-type').change(productReviewType); // 정렬 선택
    $('#review-section').on('click', '.review-delete', productReviewRemove);

    productReviewsRead();
});

async function productReviewsRead(e) { // 상품 리뷰들 목록 가져오기
    if (typeof e === 'object' && e.hasOwnProperty('type')) { // 매개변수 e가 이벤트인지 아닌지, 이벤트면 true (productInfo에서 productReviewRead()를 호출하고 있으므로 if문 필요)
        e.preventDefault(); // 기본 동작을 하지 않음. (페이지 이동 또는 해당 페이지 맨 위로 이동 등등)
        e.stopPropagation(); // 버튼 클릭이 상위 엘리먼트로 전파되는 것을 막음
    }

    const sort = Number($('#select-review-type').val()); // 최신순, 좋아요순 가져오기
    let userId = getUserIdFromUrl();
    let receiptImg; // 인증 리뷰 or 일반 리뷰
    let offset = 0; // 리뷰를 어디까지 읽었는지 알려주는 변수
    let receiptMark; // 인증, 미인증 표기 변수
    if($('.btn-reviews[aria-selected="true"]').attr('id')=='receipt-reviews-tab') { // 인증 리뷰인지 아닌지 확인
        receiptImg = 1;
        receiptMark='<span class="text-primary ms-3 fw-bold">인증</span>';
    } else {
        receiptImg = 0;
        receiptMark='<span class="text-danger ms-3 fw-bold">미인증</span>';
    }
    const queryString = { // 쿼리 스트링으로 만들기 위함
        userId:userId,
        offset:offset,
        receiptImg:receiptImg,
        sort:sort
    }
    const userInfo = await getUserInfo(); // 로그인 한 유저 정보 가져오기
    const response = await fetch('http://localhost:8081/mypage/{userId}/reviews?'+$.param(queryString)); // 서버에 데이터 요청 후 응답 기다림. 반환 데이터는 Promise 객체

    const data = await response.json(); // 응답 Content-Type이 application/json인 경우 응답 body가 JSON형태의 데이터로 변환이 되면 성공 메세지가 담긴 Promise객체 return -> await 연산자와 함께 처리(fullfilled) 되면 최종적으로 JavaScript 객체로 변환 및 return

    const likeReviewResponse = await fetch('http://localhost:8081/products/review/likeReview/'+userInfo.userId);
    const likeReviewList = await likeReviewResponse.json();
    let item = data.dtoList[0];
    if (item) {
        let releaseDate = new Date(item.reviewDate).toISOString().split('T')[0];
        let reviewImage = item.reviewImg ? `<img src="${item.reviewImg}" alt="" class="img-fluid">` : '';
        let reviewImageContainer = reviewImage ? `<div class="border icon-shape icon-lg border-2 ">${reviewImage}</div>` : '';
        let btnDelete;
        let likeReview;

        if(userInfo!=null && userInfo.userId == `${item.userId}`) {
            btnDelete = `<a href="#" class="text-muted review-delete" data-reviewId="${item.reviewId}"><i class="bi bi-trash me-1"></i>삭제하기</a>`
        } else {
            btnDelete = `<a href="#" class="text-muted review-delete" data-reviewId="${item.reviewId}" hidden><i class="bi bi-trash me-1"></i>삭제하기</a>`
        }

        // 좋아요 버튼은 mypage에서는 fill 상태로 고정
        likeReview = `<a href="#" class="text-muted ms-4 d-block btn-reviewLike active" data-reviewId="${item.reviewId}"><i class="bi bi-suit-heart-fill me-1"></i>좋아요
                                  <span class="translate-middle-y badge rounded-pill bg-white text-muted">${item.reviewLikes}</span>
                          </a>`;

        let reviewText = `<div class="d-flex border-bottom pb-6 mb-6">
                            <img src="${item.userImg}" alt=""
                              class="rounded-circle avatar-lg login-image">
                            <div class="ms-5 flex-grow-1">
                              <h6 class="mb-1">
                                ${item.userName}
                                ${btnDelete}
                              </h6>
                              <p class="small"> <span class="text-muted">${releaseDate}</span>
                                ${receiptMark}
                              </p>
                                <div class="text-dark">
                                  좋았던 점: <span style="color: gray">${item.goodReviews}</span>
                                </div>
                                <div class="text-dark my-2">
                                  아쉬운 점: <span style="color: gray">${item.badReviews}</span>
                                </div>
                              <div>
                                ${reviewImageContainer}
                              </div>
                              <!-- icon -->
                              <div class="d-flex justify-content-end mt-4">
                                <a href="#" class="text-muted btn-reviewComment" data-bs-toggle="collapse" data-bs-target="#${item.reviewId}"><i class="bi bi-chat-dots me-1"></i>댓글
                                  <span class="translate-middle-y badge rounded-pill bg-pink-300">${item.commentNum}</span>
                                </a>
                                ${likeReview}
                              </div>
                              <div class="collapse" id="${item.reviewId}"></div>
                            </div>
                          </div>`;
        $('#review-section').append(reviewText);
    }
}

async function productReviewRemove (e) {
    e.preventDefault();
    e.stopPropagation();

    const reviewId = $(this).closest('.review-delete').data('reviewid');
    const response = await fetch('http://localhost:8081/products/review/reviewDelete/'+reviewId, {
        method:'DELETE'
    });

    const responseData = await response.json();
    const reviewCount = responseData.reviewCount;
    $("#product-review").text(`(리뷰 개수 ${reviewCount})`);

    $('#review-section').empty();
    pageOffset.init();
    productReviewsRead(e);
}

let event;
let reviewId;

function productReviewMore(e) {
    pageOffset.increaseOffset();
    productReviewsRead(e);
}

function productReviewType(e) {
    let selectedValue = $(this).val();
    $(this).find('option').prop('selected', false);
    $(this).find('option[value="' + selectedValue + '"]').prop('selected', true);
    $('#review-section').empty();
    productReviewsRead(e);
}

function productReviewTab(e) {
    $('#select-review-type').find('option').prop('selected', false);
    $('#select-review-type').find('option[value="0"]').prop('selected', true);
    $('#review-section').empty();
    productReviewsRead(e);
}
