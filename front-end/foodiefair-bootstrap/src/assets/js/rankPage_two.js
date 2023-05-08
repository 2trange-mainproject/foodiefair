// 이벤트를 처리하는 함수를 분리하여 다른 탭에서 이벤트를 추가할 수 있도록 합니다.
function loadRankPageTwo() {
    // 기존의 rankPage_two.js 코드
    function getSelectedFilters() {
        var categories = [];

        if ($("#simple-01").is(":checked")) {
            categories.push("도시락");
        }
        if ($("#simple-02").is(":checked")) {
            categories.push("샌드위치/햄버거");
        }
        if ($("#simple-03").is(":checked")) {
            categories.push("샐러드");
        }
        if ($("#simple-04").is(":checked")) {
            categories.push("주먹밥/김밥");
        }
        if ($("#simple-05").is(":checked")) {
            categories.push("가공식품");
        }
        if ($("#simple-06").is(":checked")) {
            categories.push("안주류");
        }
        if ($("#instant-01").is(":checked")) {
            categories.push("튀김류");
        }
        if ($("#instant-02").is(":checked")) {
            categories.push("베이커리");
        }
        if ($("#instant-03").is(":checked")) {
            categories.push("즉석커피");
        }
        if ($("#cookie-01").is(":checked")) {
            categories.push("스낵/비스켓");
        }
        if ($("#cookie-02").is(":checked")) {
            categories.push("빵/디저트");
        }
        if ($("#cookie-03").is(":checked")) {
            categories.push("아이스크림");
        }
        if ($("#cookie-04").is(":checked")) {
            categories.push("껌/초콜릿/캔디");
        }
        if ($("#drink-01").is(":checked")) {
            categories.push("음료");
        }
        if ($("#drink-02").is(":checked")) {
            categories.push("아이스드링크");
        }
        if ($("#drink-03").is(":checked")) {
            categories.push("유제품");
        }

        var selectedBadge = $("#badgeReviewer .nav-link.active").attr("id").split("-")[0];
        return { categories: categories, selectedBadge: selectedBadge };
    }

    function loadUsers(page) {
        var filters = getSelectedFilters();

        var queryString = `?page=${page}&size=12`;

        if (filters.categories.length > 0) {
            queryString += `&categories=${encodeURIComponent(JSON.stringify(filters.categories))}`;
        }

        queryString += `&selectedBadge=${filters.selectedBadge}`;

        $.ajax({
            url: `http://localhost:8081/api/reviewer-badge${queryString}`,
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
        var $userBadgeContainer = $('#userBadgeContainer');
        $userBadgeContainer.empty();
        var productHtml = '';

        var filters = getSelectedFilters();
        var filteredProductCount = 0;

        $.each(data, function(index, user) {

            filteredProductCount++;

            productHtml += `
            <div class="col">
              <div class="card card-product">
                <div class="card-body">
                  <div class="text-center position-relative">
                    <a href="mypage?userId=${user.userId}">
                        <img class="mb-3 img-fluid" style="max-width: 250px; max-height: 250px;" src="${user.userImg}">
                    </a>
                  </div>
                  <div class="text-center">
                    <h2 class="fs-3"><a href="mypage?userId=${user.userId}" class="text-inherit text-decoration-none">${user.userName}</a></h2>
                    <div class="text-muted fs-5"><a href="#!" class="text-decoration-none text-pink">${user.totalReviewCount}개 이용후기</a></div>
                  </div>
                </div>
              </div>
            </div>
          `;
        });

        var productListHtml = `
      <div class="row g-4 row-cols-xl-4 row-cols-lg-3 row-cols-2 row-cols-md-2 mt-2">
        ${productHtml}
      </div>
      <div class="row mt-8">
        <div class="col">
            <nav>
                <ul class="pagination">
                </ul>
            </nav>
        </div>
      </div>
    `;

        $userBadgeContainer.append(productListHtml);
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

    // 체크박스의 상태 변경시 제품 목록을 다시 불러옵니다.
    $("input[type='checkbox']").on("change", function () {
        loadUsers(1);
    });

    // 탭 버튼을 클릭하면 탭에 따른 제품 목록을 불러옵니다.
    $("#badgeReviewer .nav-link").on("click", function () {
        $("#badgeReviewer .nav-link").removeClass("active");
        $(this).addClass("active");
        loadUsers(1);
    });

    loadUsers(1);
}

// 페이지 로드 시 loadRankPageTwo 함수 호출
$(document).ready(function () {
    loadRankPageTwo();
});

// 탭 이동 시 이벤트 처리 추가
$("a[data-toggle='pill']").on("shown.bs.tab", function (e) {
    var target = $(e.target).attr("href");
    if (target === "#gold-tab") {
        loadRankPageTwo();
    }
});