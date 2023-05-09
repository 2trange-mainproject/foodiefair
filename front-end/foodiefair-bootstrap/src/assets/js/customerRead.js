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
        url: `http://localhost:8081/user-read/${userId}`,
        type: "GET",
        dataType: "json",
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

    userHtml += `
          <!-- form -->
          <form>
            <h6>*은 필수 사항입니다.</h6>
            <div class="row g-3">
              <h4>프로필 업로드</h4>
              <input type="file" onchange="readURL(this);" style="margin-top: 1px" required>
              <div class="col-12" style="margin-top: 4px; text-align: center;">
                <img src="${user.userImg}" id="preview" style="max-width: 220px; max-height: 220px;"/>
              </div>

              <!-- col -->
              <div class="col-12">
                <h5>*닉네임</h5>
                <!-- 닉네임 input -->
                <input type="text" class="form-control" id="userNickName" value="${user.userName}" required>
              </div>
              <div class="col-12">
                <h5>마이태그</h5>
                <input type="text" class="form-control" id="mytag" placeholder="프로필에 넣고 싶은 태그를 적어주세요." name="userTag">
                <div class="tags-container mt-2"></div>
              </div>
              <div class="col-12">
                <div class="col-12">
                  <form>
                    <h5>자기 소개</h5>
                    <p><textarea cols="50" rows="10" placeholder="프로필에 넣고 싶은 자기소개를 적어주세요.">${user.userIntro}</textarea></p>
                  </form>
                </div>
              </div>


              <div class="col-12">
              <!-- btn -->
              <div class="col-12 d-grid"> <button type="submit" class="btn btn-pink">등록하기</button>
              </div>

              <!-- text -->
              <p><small>By continuing, you agree to our <a href="#!" style="color: hotpink;"> Terms of Service</a> & <a href="@@webRoot/pages/contract" style="color: hotpink;">Privacy Policy</a></small></p>
            </div>
          </form>
          `;

    var userListHtml = `
            ${userHtml}
    `;

    $userContainer.append(userListHtml);
}