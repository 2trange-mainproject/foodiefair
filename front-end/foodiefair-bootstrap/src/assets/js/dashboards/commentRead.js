$(document).ready(function () {
    var commentId = getCommentIdFromUrl();
    loadCommentDetails(commentId);
});

function getCommentIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("commentId");
}

function loadCommentDetails(commentId) {
    $.ajax({
        url: `https://115.85.182.117/dashboard/comment-read/${commentId}`,
        type: "GET",
        dataType: "json",
        xhrFields: {
            withCredentials: true // 쿠키를 전송하려면 이 옵션을 설정해야 합니다.
        },
        success: function (response) {
            renderCommentDetails(response.commentRead);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function renderCommentDetails(comment) {
    var $commentContainer = $('#commentContainer');
    $commentContainer.empty();
    var commentHtml = '';

    var releaseDate = new Date(comment.commentDate).toISOString().split('T')[0];

    commentHtml += `
          <div class="col-12">
            <!-- card -->
            <div class="card mb-6 card-lg">
              <!-- card body -->
              <div class="card-body p-6 ">
                <div class="row">
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">댓글 ID</label>
                    <input type="text" class="form-control" value="${comment.commentId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">회원 ID</label>
                    <input type="text" class="form-control" value="${comment.userId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">리뷰 ID</label>
                    <input type="text" class="form-control" value="${comment.reviewId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">댓글 작성 날짜</label>
                    <input type="text" class="form-control" value="${releaseDate}" disabled>
                  </div>
                  <!-- input -->
                  <div>
                    <label class="form-label">댓글 내용</label>
                    <textarea style="height: auto; max-height: 500px;" class="form-control" disabled>${comment.commentContent}</textarea>
                  </div>
                </div>
              </div>
            </div>

          </div>
          `;

    var commentListHtml = `
        <div class="row">
            ${commentHtml}
        </div>
    `;

    $commentContainer.append(commentListHtml);
}