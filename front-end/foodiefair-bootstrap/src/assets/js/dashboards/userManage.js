document.addEventListener('DOMContentLoaded', function () {
    // LocalStorage에서 저장된 검색 키워드 값을 가져옵니다.
    const searchKeyword = localStorage.getItem('searchKeyword');

    // 검색 키워드 값을 검색창에 설정합니다.
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = searchKeyword;
    }

    toggleResetSearchButton();
});

//다른 페이지 이동 시 키워드값 삭제
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        localStorage.removeItem('searchKeyword');
    });
});

//'검색어 초기화' 버튼 눌렀을 때
document.getElementById('reset-search').addEventListener('click', function () {
    // LocalStorage에서 검색어를 삭제
    localStorage.removeItem('searchKeyword');

    // 입력 필드의 값을 초기화
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';

    //검색어 없을 때 버튼 없애기
    toggleResetSearchButton();

    // 페이지를 새로고침하거나 데이터를 다시 불러오기
    loadUsers(1);
});

function toggleResetSearchButton() {
    const searchKeyword = localStorage.getItem('searchKeyword');
    const resetSearchButton = document.getElementById('reset-search');

    if (searchKeyword && searchKeyword.length > 0) {
        resetSearchButton.style.display = 'block';
    } else {
        resetSearchButton.style.display = 'none';
    }
}


// 검색 폼 이벤트 리스너 추가
$("#searchForm").on("submit", function (event) {
    event.preventDefault();
    var keyword = $("#searchInput").val();
    loadUsers(1, null);

    redirectToShopFilterPage();
});

$(".form-select").on("change", function() {
    loadUsers(1, $(this).val());
});

$(document).on("click", ".delete-user", function (event) {
    event.preventDefault();
    var userId = $(this).data("user-id");
    deleteUser(userId);
});

function deleteUser(userId) {
    if (!confirm("정말로 이 회원을 삭제하시겠습니까?")) {
        return;
    }

    $.ajax({
        url: `http://localhost:8081/dashboard/user-delete/${userId}`,
        type: "DELETE",
        success: function (response) {
            alert("회원이 삭제되었습니다.");
            loadUsers(1);
        },
        error: function (error) {
            console.log(error);
            alert("회원 삭제에 실패하였습니다.");
        },
    });
}

function loadUsers(page, sortOrder) {
    const searchKeyword = localStorage.getItem('searchKeyword');
    console.log('검색 키워드:', searchKeyword);

    var queryString = `?page=${page}&size=12`;

    if (sortOrder) {
        queryString += `&sortOrder=${sortOrder}`;
    }

    if (searchKeyword) {
        queryString += `&searchKeyword=${encodeURIComponent(searchKeyword)}`;
    }

    $.ajax({
        url: `http://localhost:8081/dashboard/user-list${queryString}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response.dtoList;
            var total = response.total;
            var currentPage = response.page;

            renderUsers(data);
            renderPagination(currentPage, total);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function renderUsers(data) {
    var $userContainer = $('#userContainer');
    $userContainer.empty();
    var userHtml = '';

    $.each(data, function(index, user) {
        var locked = user.locked ? "TRUE" : "FALSE";

        userHtml += `
                      <tr>
                          <td class="pe-0">
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" value="" id="customerEleven">
                              <label class="form-check-label" for="customerEleven">

                              </label>
                            </div>
                          </td>

                          <td>
                            <div class="d-flex align-items-center">
                              <img src="${user.userImg}" alt=""
                                class="avatar avatar-xs rounded-circle">
                              <div class="ms-2">
                                <a href="read-customer?userId=${user.userId}" class="text-inherit">${user.userName}</a>
                              </div>
                            </div>
                          </td>
                          <td><a href="read-customer?userId=${user.userId}" style="color: black">${user.userEmail}</a></td>
                          <td><a href="read-customer?userId=${user.userId}" style="color: black">${user.userTag}</a></td>
                          <td><a href="read-customer?userId=${user.userId}" style="color: black">${user.userReport}</a></td>
                          <td><a href="read-customer?userId=${user.userId}" style="color: black">${locked}</a></td>
                          <td>
                            <div class="dropdown ">
                              <a href="#" class="text-reset" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="feather-icon icon-more-vertical fs-5"></i>
                              </a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item delete-user" href="#" data-user-id="${user.userId}"><i class="bi bi-trash me-3"></i>Delete</a></li>
                                <li><a class="dropdown-item" href="edit-user?userId=${user.userId}"><i class="bi bi-pencil-square me-3 "></i>Edit</a></li>
                              </ul>
                            </div>
                          </td>
                        </tr>
          `;
    });

    var userListHtml = `
        ${userHtml}
    `;

    $userContainer.append(userListHtml);
}

function renderPagination(currentPage, totalItems) {
    var totalPages = Math.ceil(totalItems / 12);
    var pageGroupSize = 5;
    var currentGroup = Math.ceil(currentPage / pageGroupSize);

    var pagination = $(".pagination");
    pagination.empty();

    // 이전 페이지 링크 추가
    var prevDisabled = currentPage === 1 ? "disabled" : "";
    pagination.append(`<li class="page-item ${prevDisabled}">
                          <a class="page-link mx-1" href="#" aria-label="Previous" data-page="${currentPage - 1}">
                            <i class="feather-icon icon-chevron-left"></i>
                          </a>
                        </li>`);

    // 페이지 번호 링크 추가
    var startPage = (currentGroup - 1) * pageGroupSize + 1;
    var endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
    for (var i = startPage; i <= endPage; i++) {
        var activeClass = i === currentPage ? "active" : "";
        var listItem = `<li class="page-item ${activeClass}">
                    <a class="page-link mx-1" href="#" data-page="${i}">${i}</a>
                  </li>`;
        pagination.append(listItem);
    }

    // 다음 페이지 링크 추가
    var nextDisabled = currentPage === totalPages ? "disabled" : "";
    pagination.append(`<li class="page-item ${nextDisabled}">
                          <a class="page-link mx-1" href="#" aria-label="Next" data-page="${currentPage + 1}">
                            <i class="feather-icon icon-chevron-right"></i>
                          </a>
                        </li>`);

    // 페이지 링크에 대한 클릭 이벤트 리스너 추가
    $(".pagination .page-link").on("click", function (event) {
        event.preventDefault();
        var pageNumber = parseInt($(this).data("page"));
        if (!isNaN(pageNumber)) {
            loadUsers(pageNumber);
        }
    });
}

$(document).ready(function () {
    loadUsers(1);
});