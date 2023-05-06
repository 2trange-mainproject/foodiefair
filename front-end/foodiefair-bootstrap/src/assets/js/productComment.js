$(document).ready(function () {
    $('#review-section').on('show.bs.collapse', function (e) { // 리뷰 댓글 열기 전 댓글 목록 가져오기
        productReviewCommentRead(e.target);
    })
    $('#review-section').on('hide.bs.collapse', function (e) { // 리뷰 댓글 닫기 전 댓글 목록 지우기
        $(e.target).empty();
    })
    $('#review-section').on('click', '.btn-comment-enroll', registerComment);
});
async function productReviewCommentRead(e) {
    const response = await fetch('http://localhost:8081/products/comment/'+e.id);
    const data = await response.json();

    data.forEach(function (item, index) {
        let comment = `<div class="border-bottom pb-4 mb-4">
                        <h6>
                          ${item.userName}<a href="#" class="text-muted ms-3 btn-comment-delete" id="${item.commentId}"><i class="bi bi-trash me-1"></i>삭제하기</a>
                        </h6>
                        <div>
                          <p class="text-dark mb-1">${item.commentContent}</p>
                        </div>
                        <div class="small text-muted">${item.commentDate}</div>
                      </div>`;
        $(e).append(comment);
    });
    let commentEnroll = `<div class="row g-3">
                        <div class="col-sm-11 comment-area">
                          <input type="text" class="form-control" placeholder="댓글을 작성해주세요.">
                        </div>
                        <div class="col-sm">
                          <button type="button" class="btn btn-outline-secondary form-control-sm btn-comment-enroll"><i class="bi bi-check2"></i></button>
                        </div>
                      </div>`;
    $(e).append(commentEnroll);
};

async function registerComment (e) {
    const sendData = {
        reviewId: await $(e.target).closest('.collapse').attr('id'),
        userId: 2, // 로그인 구현되면 바꿔줘야 함
        commentContent: await $(e.target).closest('.row').find('input').val()
    }
    const response = await fetch('http://localhost:8081/products/comment/', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(sendData)
    });
    const data = await response.json();
    await $(e.target).closest('.collapse').siblings('.d-flex').find('.bg-pink-300').text(data); // 댓글 개수 업데이트
    const event = e.target.closest('.collapse'); // productReviewCommentRead로 넘길 위치 저장 (저장 안 하고 empty() 쓰면 이벤트 위치가 사라져서 찾을 수 없음)
    await $(e.target).closest('.collapse').empty(); // 페이지 비우기
    productReviewCommentRead(event); // 다시 댓글 목록 가져오기
}