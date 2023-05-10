$(document).ready(function () {
    var userId = getUserIdFromUrl();
    loadUserDetails(userId);
});

function getUserIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userId");
}

function loadUserDetails(userId) {
    $.ajax({
        url: `http://localhost:8081/dashboard/user-read/${userId}`,
        type: "GET",
        dataType: "json",
        xhrFields: {
            withCredentials: true // 쿠키를 전송하려면 이 옵션을 설정해야 합니다.
        },
        success: function (response) {
            renderUserDetails(response.userRead);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function renderUserDetails(user) {
    var $userContainer = $('#userContainer');
    $userContainer.empty();
    var userHtml = '';

    var lockedChecked = user.locked == 1 ? "checked" : "";

    userHtml += `
          <div class="col-lg-8 col-12">
            <!-- card -->
            <div class="card mb-6 card-lg">
              <!-- card body -->
              <div class="card-body p-6 ">
                <div class="row">
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">회원 ID</label>
                    <input type="text" class="form-control" value="${user.userId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">비밀번호</label>
                    <input type="password" class="form-control" value="${user.userPwd}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">이메일</label>
                    <input type="text" class="form-control" value="${user.userEmail}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">닉네임</label>
                    <input type="text" class="form-control" value="${user.userName}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">자기소개</label>
                    <textarea style="height: auto; max-height: 500px;" class="form-control" disabled>${user.userIntro}</textarea>
                  </div>
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">마이태그</label>
                    <textarea style="height: auto; max-height: 500px;" class="form-control" disabled>${user.userTag}</textarea>
                  </div>
                  <label class="form-label">프로필 사진</label>
                  <div class="mb-3 col-lg-6">
                    <!-- input -->
                    <img src="${user.userImg}" class="mb-3 img-fluid">
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="col-lg-4 col-12">
            <!-- card -->
            <div class="card mb-6 card-lg">
              <!-- card body -->
              <div class="card-body p-6">
                <!-- input -->
                <div class="form-check form-switch mb-4">
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchStock" ${lockedChecked} disabled>
                  <label class="form-check-label" for="flexSwitchStock"> Locked</label>
                </div>
                <!-- input -->
                <div>
                  <div class="mb-3">
                    <label class="form-label">신고횟수</label>
                    <input type="text" class="form-control" value="${user.userReport}" disabled>
                  </div>
                </div>
              </div>
            </div>
            <!-- button -->
            <div class="d-grid">
              <a href="edit-customer?userId=${user.userId}" class="btn btn-pink">
                회원정보 수정하기
              </a>
            </div>
          </div>
          `;

    var userListHtml = `
        <div class="row">
            ${userHtml}
        </div>
    `;

    $userContainer.append(userListHtml);
}