$(document).ready(function () {
    var userId = getUserIdFromUrl();
    loadUserDetails(userId);

    $(document).on('click', '#update-user', function () {
        updateUser(userId);
    });
});

function getUserIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userId");
}

function loadUserDetails(userId) {
    $.ajax({
        url: `https://115.85.183.196:8081/dashboard/user-read/${userId}`,
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

    // userTag 추출
    var tagRegexp = /"tag": "([^"]*)"/g;
    var userTagString = "";
    var match;
    while ((match = tagRegexp.exec(user.userTag)) !== null) {
        if (userTagString !== "") {
            userTagString += ", ";
        }
        userTagString += "#" + match[1];
    }

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
                    <textarea style="height: auto; max-height: 500px;" class="form-control" disabled>${userTagString}</textarea>
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
                  <input class="form-check-input" type="checkbox" role="switch" id="user-locked" ${lockedChecked}>
                  <label class="form-check-label" for="flexSwitchStock"> Locked</label>
                </div>
                <!-- input -->
                <div>
                  <div class="mb-3">
                    <label class="form-label">신고횟수</label>
                    <input type="text" class="form-control" id="user-report" value="${user.userReport}">
                  </div>
                </div>
              </div>
            </div>
            <!-- button -->
            <div class="d-grid">
              <a href="#" class="btn btn-pink" id="update-user">
                회원정보 수정 완료
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

function updateUser(userId){
    var updatedUserLocked = $("#user-locked").is(":checked") ? 1 : 0;
    var updatedUserReport = $("#user-report").val();

    $.ajax({
        url: `https://115.85.183.196:8081/dashboard/user-update/${userId}`,
        type: "PUT",
        dataType: "text",
        data: {
            updatedUserLocked: updatedUserLocked,
            updatedUserReport: updatedUserReport,
        },
        xhrFields: {
            withCredentials: true // 쿠키를 전송하려면 이 옵션을 설정해야 합니다.
        },
        success: function (response) {
            alert('상품이 성공적으로 수정되었습니다.');
            window.location.href = 'read-customer?userId=' + userId;
        },
        error: function (error) {
            console.log(error);
            alert('상품 수정에 실패했습니다. 다시 시도해주세요.');
        },
    });
}