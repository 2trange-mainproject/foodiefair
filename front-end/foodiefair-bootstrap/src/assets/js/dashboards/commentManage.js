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
    loadComments(1);
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
    loadComments(1, null);

    redirectToShopFilterPage();
});

$(".form-select").on("change", function() {
    loadComments(1, $(this).val());
});

$(document).on("click", ".delete-comment", function (event) {
    event.preventDefault();
    var commentId = $(this).data("comment-id");
    deleteComment(commentId);
});

function deleteComment(commentId) {
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
        return;
    }

    $.ajax({
        url: `https://www.foodiefair.shop/dashboard/comment-delete/${commentId}`,
        type: "DELETE",
        xhrFields: {
            withCredentials: true // 쿠키를 전송하려면 이 옵션을 설정해야 합니다.
        },
        success: function (response) {
            alert("댓글이 삭제되었습니다.");
            loadComments(1);
        },
        error: function (error) {
            console.log(error);
            alert("댓글 삭제에 실패하였습니다.");
        },
    });
}

function loadComments(page, sortOrder) {
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
        url: `https://www.foodiefair.shop/dashboard/comment-list${queryString}`,
        type: "GET",
        dataType: "json",
        xhrFields: {
            withCredentials: true // 쿠키를 전송하려면 이 옵션을 설정해야 합니다.
        },
        success: function (response) {
            var data = response.dtoList;
            var total = response.total;
            var currentPage = response.page;

            renderComments(data);
            renderPagination(currentPage, total);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

//문장 자르기
function truncateString(str, num) {
    return str.length > num ? str.slice(0, num) + "..." : str;
}

function renderComments(data) {
    var $commentContainer = $('#commentContainer');
    $commentContainer.empty();
    var commentHtml = '';

    $.each(data, function(index, comment) {
        var releaseDate = new Date(comment.commentDate).toISOString().split('T')[0];

        commentHtml += `
                      <tr>

                        <td>
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="orderOne">
                            <label class="form-check-label" for="orderOne">

                            </label>
                          </div>
                        </td>
                        <td><a href="read-comment?commentId=${comment.commentId}" class="text-reset">${comment.commentId}</a></td>
                        <td><a href="read-comment?commentId=${comment.commentId}" class="text-reset">${comment.userId}</a></td>
                        <td><a href="read-comment?commentId=${comment.commentId}" class="text-reset">${comment.reviewId}</a></td>
                        <td><a href="read-comment?commentId=${comment.commentId}" class="text-reset">${truncateString(comment.commentContent, 20)}</a></td>
                        <td><a href="read-comment?commentId=${comment.commentId}" class="text-reset">${releaseDate}</a></td>

                        <td>
                          <div class="dropdown">
                            <a href="#" class="text-reset" data-bs-toggle="dropdown" aria-expanded="false">
                              <i class="feather-icon icon-more-vertical fs-5"></i>
                            </a>
                            <ul class="dropdown-menu">
                              <li><a class="dropdown-item delete-comment" href="#" data-comment-id="${comment.commentId}"><i class="bi bi-trash me-3"></i>삭제하기</a></li>
                            </ul>
                          </div>
                        </td>
                      </tr>
          `;
    });

    var commentListHtml = `
        ${commentHtml}
    `;

    $commentContainer.append(commentListHtml);
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
            loadComments(pageNumber);
        }
    });
}

$(document).ready(function () {
    loadComments(1);
});