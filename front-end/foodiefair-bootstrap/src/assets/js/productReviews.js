function getProductIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("productId");
}

function pageStartNum() { // 클로저 정의. 리뷰 offset으로 사용할 예정
    let offset=0
    return {
        init () {
            offset=0;
        },
        increaseOffset() {
            offset+=3;
        },
        val() {
            return offset;
        }
    }
};

let pageOffset = pageStartNum();

$(document).ready(function (){
    $(window).on('unload', function (){ // 페이지 이동시 null로 바꿔줌으로써 가비지 컬렉터가 수거
        pageOffset = null;
    });

    $('.btn-reviews').click(productReviewTab) // 리뷰 탭 이동시 html 초기화 및 해당 탭  리뷰 목록 가져오기
    $('#review-section').on('click', '.btn-reviewLike', productReviewLike); // 리뷰 좋아요 눌렀을 때 토글 및 DB저장, 숫자 반영
    $('.btn-reviewMore').click(productReviewMore); // 리뷰 더보기 버튼
    $('#select-review-type').change(productReviewType); // 정렬 선택
});

async function productReviewsRead(e) { // 상품 리뷰들 목록 가져오기
    if (typeof e === 'object' && e.hasOwnProperty('type')) { // 매개변수 e가 이벤트인지 아닌지, 이벤트면 true (productInfo에서 productReviewRead()를 호출하고 있으므로 if문 필요)
        e.preventDefault(); // 기본 동작을 하지 않음. (페이지 이동 또는 해당 페이지 맨 위로 이동 등등)
        e.stopPropagation(); // 버튼 클릭이 상위 엘리먼트로 전파되는 것을 막음
    }

    const sort = Number($('#select-review-type').val()); // 최신순, 좋아요순 가져오기
    let productId = getProductIdFromUrl();
    let receiptImg; // 인증 리뷰 or 일반 리뷰
    let offset; // 리뷰를 어디까지 읽었는지 알려주는 변수
    let receiptMark; // 인증, 미인증 표기 변수
    if($('.btn-reviews[aria-selected="true"]').attr('id')=='receipt-reviews-tab') { // 인증 리뷰인지 아닌지 확인
        receiptImg = 1;
        offset = pageOffset.val(); // 클로저 변수에서 데이터를 가져옴
        receiptMark='<span class="text-primary ms-3 fw-bold">인증</span>';
    } else {
        receiptImg = 0;
        offset = pageOffset.val(); // 클로저 변수에서 데이터를 가져옴
        receiptMark='<span class="text-danger ms-3 fw-bold">미인증</span>';
    }
    const queryString = { // 쿼리 스트링으로 만들기 위함
        productId:productId,
        offset:offset,
        receiptImg:receiptImg,
        sort:sort
    }
    const response = await fetch('http://localhost:8081/products/review/reviewRead?'+$.param(queryString)); // 서버에 데이터 요청 후 응답 기다림. 반환 데이터는 Promise 객체
    const data = await response.json(); // 응답 Content-Type이 a// plication/json인 경우 응답 body가 JSON형태의 데이터로 변환이 되면 성공 메세지가 담긴 Promise객체 return -> await 연산자와 함께 처리(fullfilled) 되면 최종적으로 JavaScript 객체로 변환 및 return
    console.log(data);

    $.each(data.dtoList, function(index, item) {
        let releaseDate = new Date(item.reviewDate).toISOString().split('T')[0];
        let reviewImage = item.reviewImg ? `<img src="${item.reviewImg}" alt="" class="img-fluid">` : '';
        let reviewImageContainer = reviewImage ? `<div class="border icon-shape icon-lg border-2 ">${reviewImage}</div>` : '';

        let reivewText = `<div class="d-flex border-bottom pb-6 mb-6">
                            <img src="${item.userImg}" alt=""
                              class="rounded-circle avatar-lg">
                            <div class="ms-5 flex-grow-1">
                              <h6 class="mb-1">
                                ${item.userName}
                                <a href="#" class="text-muted review-delete" data-reviewId="${item.reviewId}"><i class="bi bi-trash me-1"></i>삭제하기</a>
                                <a href="#" class="text-muted ms-3 review-modify" data-reviewId="${item.reviewId}"><i class="bi bi-pencil me-1"></i>수정하기</a>
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
                                <a href="#" class="text-muted btn-reviewComment" data-bs-toggle="collapse" data-userId="${item.userId}" data-bs-target="#${item.reviewId}"><i class="bi bi-chat-dots me-1"></i>댓글
                                  <span class="translate-middle-y badge rounded-pill bg-pink-300">${item.commentNum}</span>
                                </a>
                                <a href="#" class="text-muted ms-4 d-block btn-reviewLike" data-userId="${item.userId}" data-reviewId="${item.reviewId}"><i class="bi bi-suit-heart me-1"></i>좋아요
                                  <span class="translate-middle-y badge rounded-pill bg-white text-muted">${item.reviewLikes}</span>
                                </a>
                              </div>
                              <div class="collapse" id="${item.reviewId}"></div>
                            </div>
                          </div>`;
        $('#review-section').append(reivewText);
    });
};

async function productReviewLike(e) { // 상품 리뷰 좋아요 토글 버튼
    e.preventDefault();
    e.stopPropagation();

    const sendData = {
        reviewId: await $(this).closest('.btn-reviewLike').data('reviewid'),
        userId: await $(this).closest('.btn-reviewLike').data('userid') // 로그인 하면 로그인 한 사람 아이디로 바꾸기. html에 유저Id 지우기, DB resultMap 유저 Id 지우기,
    };
    $(this).toggleClass('active'); // 토글 활성화
    if ($(this).hasClass('active')) {  // 토글 활성화시 데이터 저장
        $(this).find('i').removeClass('bi-suit-heart').addClass('bi-suit-heart-fill');
        const response = await fetch('http://localhost:8081/products/review/likeReview', { // 좋아요 총 개수 Promise형태로 반환
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        });
        const data = await response.json(); // Promise형태를 json으로, Integer 값이라 바로 사용 가능한듯
        await $(this).find('.badge').text(data); // 하위 자식중에 badge를 찾아서 좋아요 개수 업데이트
    } else { // 토글 비활성화시 데이터 삭제
        $(this).find('i').removeClass('bi-suit-heart-fill').addClass('bi-suit-heart');
        const response = await fetch('http://localhost:8081/products/review/likeReview/'+sendData.reviewId+'/'+sendData.userId, { // 좋아요 총 개수 Promise형태로 반환
            method:'DELETE'
        });
        const data = await response.json(); // Promise형태를 json으로, Integer 값이라 바로 사용 가능한듯
        await $(this).find('.badge').text(data); // 하위 자식중에 badge를 찾아서 좋아요 개수 업데이트
    }
};

function productReviewMore(e) {
    pageOffset.increaseOffset();
    productReviewsRead(e);
}

function productReviewType(e) {
    let selectedValue = $(this).val();
    $(this).find('option').prop('selected', false);
    $(this).find('option[value="' + selectedValue + '"]').prop('selected', true);
    pageOffset.init();
    $('#review-section').empty();
    productReviewsRead(e);
}

function productReviewTab(e) {
    $('#select-review-type').find('option').prop('selected', false);
    $('#select-review-type').find('option[value="0"]').prop('selected', true);
    $('#review-section').empty();
    pageOffset.init();
    productReviewsRead(e);
}