$(document).ready(function () {
    var reviewId = getReviewIdFromUrl();
    loadReviewDetails(reviewId);
});

function getReviewIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("reviewId");
}

function loadReviewDetails(reviewId) {
    $.ajax({
        url: `http://localhost:8081/dashboard/review-read/${reviewId}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            renderReviewDetails(response.reviewRead);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function renderReviewDetails(review) {
    var $reviewContainer = $('#reviewContainer');
    $reviewContainer.empty();
    var reviewHtml = '';

    var releaseDate = new Date(review.reviewDate).toISOString().split('T')[0];
    var receipt = review.receiptImg ? "TRUE" : "FALSE";

    reviewHtml += `
          <div class="col-12">
            <!-- card -->
            <div class="card mb-6 card-lg">
              <!-- card body -->
              <div class="card-body p-6 ">
                <div class="row">
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">리뷰 ID</label>
                    <input type="text" class="form-control" value="${review.reviewId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">회원 ID</label>
                    <input type="text" class="form-control" value="${review.userId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">상품 ID</label>
                    <input type="text" class="form-control" value="${review.productId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">등록일자</label>
                    <input type="text" class="form-control" value="${releaseDate}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">좋아요 개수</label>
                    <input type="text" class="form-control" value="${review.reviewLikes}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">영수증 여부</label>
                    <input type="text" class="form-control" value="${receipt}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">좋았던 점</label>
                    <textarea style="height: auto; max-height: 500px;" class="form-control" disabled>${review.goodReviews}</textarea>
                  </div>
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">아쉬웠던 점</label>
                    <textarea style="height: auto; max-height: 500px;" class="form-control" disabled>${review.badReviews}</textarea>
                  </div>
                  <div>
                    <div class="mb-3 col-lg-12 mt-5">
                      <!-- heading -->
                      <h4 class="mb-3 h5">음식 사진</h4>

                      <!-- input -->
                      <img src="#{review.reviewImg}" class="mb-3 img-fluid">
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          `;

    var reviewListHtml = `
        <div class="row">
            ${reviewHtml}
        </div>
    `;

    $reviewContainer.append(reviewListHtml);
}