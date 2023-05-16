const tags = [];
var tagsContainer;

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
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            renderUserDetails(response.userRead, response.badgeRead);
        },
        error: function (error) {
        },
    });
}

function renderUserDetails(user, badge) {
    var $userContainer = $('#userContainer');
    $userContainer.empty();
    var userHtml = '';

    // selectedBadge에서 키워드 추출
    const selectedBadgeKeyword = badge.selectedBadge.split(" ")[0];

    // userBadge를 객체로 파싱
    const userBadgeObject = JSON.parse(badge.userBadge);

    // 각 badge에 대해 option 생성
    let badgeOptionsHtml = '';
    for (const keyword in userBadgeObject) {
        badgeOptionsHtml += `<option value="${keyword} ${userBadgeObject[keyword]}" ${keyword === selectedBadgeKeyword ? 'selected' : ''}>${keyword} ${userBadgeObject[keyword]}</option>`;
    }

    userHtml += `
          <!-- form -->
          <form id="customerRead-form">
            <h6>*은 필수 사항입니다.</h6>
            <div class="row g-3">
              <h4>프로필 업로드</h4>
              <input type="file" onchange="readURL(this);" id="userImg" style="margin-top: 1px" name="userImg" src="${user.userImg}">
              <div class="col-12" style="margin-top: 4px; text-align: center;">
                <img src="${user.userImg}" id="preview" style="max-width: 220px; max-height: 220px;"/>
              </div>
              <!-- col -->
              <div class="col-12 mt-sm-2 mt-md-4">
                <h5>*닉네임</h5>
                <!-- 닉네임 input -->
                <input type="text" class="form-control" id="userName" value="${user.userName}" name="userName" required>
              </div>
              <div class="col-12 mt-sm-2 mt-md-4">
                <h5>대표뱃지</h5>
                <select class="form-select" id="selectedBadge" name="selectedBadge">
                  ${badgeOptionsHtml}
                </select>
              </div>
              <div class="col-12 mt-sm-2 mt-md-4">
                <h5>마이태그</h5>
                <input type="text" class="form-control" id="mytag" placeholder="프로필에 넣고 싶은 태그를 적어주세요." name="userTag">
                <div class="tags-container mt-2"></div>
              </div>
              <div class="col-12 mt-sm-2 mt-md-3">
                  <form>
                    <h5>자기 소개</h5>
                    <p><textarea cols="50" rows="6" placeholder="프로필에 넣고 싶은 자기소개를 적어주세요." name="userIntro">${user.userIntro}</textarea></p>
                  </form>
              </div>
              <!-- btn -->
              <div class="col-12 d-grid"> <button type="submit" class="btn btn-pink" id="update-button">수정하기</button>
              </div>

              <!-- text -->
              <p><small>By continuing, you agree to our <a href="#!" style="color: hotpink;"> Terms of Service</a> & <a href="@@webRoot/pages/contract" style="color: hotpink;">Privacy Policy</a></small></p>
            </div>
            <input type="hidden" name="userId" value="${user.userId}">
            <input type="hidden" name="userEmail" value="${user.userEmail}">
          </form>
          `;

    var userListHtml = `
            ${userHtml}
    `;

    $userContainer.append(userListHtml);

    // JSON 문자열을 JavaScript 객체로 변환
    const userTagsObject = JSON.parse(user.userTag);

    // userTagsObject에서 userTag 배열을 추출
    const userTagsArray = userTagsObject.userTag;

    // 태그 컨테이너를 찾기
    tagsContainer = document.querySelector('.tags-container');

    // tags 배열을 채우기
    tags.splice(0, tags.length, ...userTagsArray.map(tagObj => tagObj.tag));

    // 태그들을 표시
    displayTags();

    document.querySelector("#mytag").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (tags.length < 10 && this.value.trim() !== "") {
                const tag = this.value.trim();
                if (tag && !tags.includes(tag)) {
                    tags.push(tag);
                    displayTags();
                }
                this.value = "";
            } else {
                alert("최대 10개의 태그까지 입력할 수 있습니다.");
            }
        }
    });
}

function displayTags() {
    tagsContainer.innerHTML = "";
    tags.forEach((tag, index) => {
        const tagElement = document.createElement("span");
        tagElement.classList.add("badge");
        tagElement.classList.add("bg-pink");
        tagElement.classList.add("me-2");
        tagElement.classList.add("mb-2");
        tagElement.textContent = "#" + tag;
        tagElement.style.cursor = "pointer";

        tagElement.addEventListener("click", () => {
            tags.splice(index, 1);
            displayTags();
        });

        tagsContainer.appendChild(tagElement);
    });
}

$(document).on("click", "#update-button", async function (event) {
    event.preventDefault();

    const userName = document.getElementById("userName").value;
    if (userName.trim() === "") {
        alert("닉네임을 입력해주세요.");
        return;
    }

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const jsonData = {};

    params.forEach(function (value, key) {
        jsonData[key] = decodeURIComponent(value);
    });

    const form = document.getElementById("customerRead-form");
    const formData = new FormData(form);

    const userTagsArray = tags.map(tag => {
        return { "tag": tag };
    });

    const userTagsObject = {
        "userTag": userTagsArray
    };

    // userTags를 JSON Array 형태로 만들기
    formData.set('userTags', JSON.stringify(userTagsObject));

    // 대표 뱃지(뱃지)
    const selectedBadge = document.getElementById("selectedBadge").value;
    formData.set("selectedBadge", selectedBadge);

    // jsonData 객체를 formData에 추가
    for (let key in jsonData) {
        formData.set(key, jsonData[key]);
    }

    //formData.set("userName", document.getElementById("userName").value);

    try {
        const response = await fetch("http://localhost:8081/modify", {
            method: "PUT",
            body: formData,
            mode: "cors",
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                alert(result.message);
                location.href = "/";
            } else {
                alert(result.message);
            }
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        alert(error.message);
    }
});

//프로필 업로드
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('preview').src = "";
    }
}
