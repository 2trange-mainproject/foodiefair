$(document).ready(function () {
    var questionId = getQuestionIdFromUrl();
    loadQuestionDetails(questionId);
});

function getQuestionIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("questionId");
}

function loadQuestionDetails(questionId) {
    $.ajax({
        url: `http://localhost:8081/dashboard/question-read/${questionId}`,
        type: "GET",
        dataType: "json",
        xhrFields: {
            withCredentials: true // 쿠키를 전송하려면 이 옵션을 설정해야 합니다.
        },
        success: function (response) {
            renderQuestionDetails(response.questionRead);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function renderQuestionDetails(question) {
    var $questionContainer = $('#questionContainer');
    $questionContainer.empty();
    var questionHtml = '';

    var releaseDate = new Date(question.questionDate).toISOString().split('T')[0];

    questionHtml += `
          <div class="col-12">
            <!-- card -->
            <div class="card mb-6 card-lg">
              <!-- card body -->
              <div class="card-body p-6 ">
                <div class="row">
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">문의 ID</label>
                    <input type="text" class="form-control" value="${question.questionId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">회원 ID</label>
                    <input type="text" class="form-control" value="${question.userId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">문의 종류</label>
                    <input type="text" class="form-control" value="${question.questionType}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">문의 날짜</label>
                    <input type="text" class="form-control" value="${releaseDate}" disabled>
                  </div>
                  <div>
                    <label class="form-label">문의 내용</label>
                    <textarea style="height: auto; max-height: 500px;" class="form-control" disabled>${question.questionContent}</textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;

    var questionListHtml = `
        <div class="row">
            ${questionHtml}
        </div>
    `;

    $questionContainer.append(questionListHtml);
}