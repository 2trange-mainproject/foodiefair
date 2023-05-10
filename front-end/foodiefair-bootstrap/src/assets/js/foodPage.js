document.addEventListener('DOMContentLoaded', function () {
    // LocalStorage에서 저장된 검색 키워드 값을 가져옵니다.
    const searchKeyword = localStorage.getItem('searchKeyword');

    // 검색 키워드 값을 검색창에 설정합니다.
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = searchKeyword;
    }

    toggleResetSearchButton();
    selectCategoryFromLocalStorage();
});

function selectCategoryFromLocalStorage() {
    const selectedCategory = localStorage.getItem("selectedCategory");

    if (selectedCategory) {
        $(`input[type='checkbox'][data-category='${selectedCategory}']`).prop("checked", true);
        localStorage.removeItem("selectedCategory");
        loadProducts(1, $(".form-select").val());
    }
}

function getSelectedFilters() {
    var stores = [];
    var categories = [];

    if ($("#CU").is(":checked")) {
        stores.push("CU");
    }
    if ($("#GS25").is(":checked")) {
        stores.push("GS25");
    }
    if ($("#Emart24").is(":checked")) {
        stores.push("이마트24");
    }
    if ($("#sevenEleven").is(":checked")) {
        stores.push("세븐일레븐");
    }

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

    return { stores: stores, categories: categories};
}

$("input[type='checkbox']").on("change", function () {
    loadProducts(1, $(".form-select").val());
});

$(".form-select").on("change", function() {
    loadProducts(1, $(this).val());
});

//페이지 새로고침 시 검색어 초기화
window.addEventListener('beforeunload', function () {
    localStorage.removeItem('searchKeyword');
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
    loadProducts(1, $(".form-select").val());
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

//food.html에서도 검색어 사용할 수 있게 만드는 기능
document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    updateSearchKeyword();
});

document.getElementById('search-button').addEventListener('click', function () {
    updateSearchKeyword();
});

function updateSearchKeyword() {
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput.value;

    // LocalStorage를 사용하여 키워드 값을 저장합니다.
    localStorage.setItem('searchKeyword', keyword);
}

//15글자 넘어가면 ...로 대체
function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    } else {
        return str;
    }
}

//페이지 로드
async function loadProducts(page, sortOrder) {
    //로그인한 유저 정보
    const loginUser = await getUserInfo();
    var userId = loginUser ? loginUser.userId : null;

    // food.html 페이지의 JavaScript 코드
    const searchKeyword = localStorage.getItem('searchKeyword');
    console.log('검색 키워드:', searchKeyword);

    var filters = getSelectedFilters();

    var queryString = `?page=${page}&size=15`;

    if (userId) {
        queryString += `&userId=${userId}`;
    }

    if (filters.stores.length > 0) {
        queryString += `&stores=${encodeURIComponent(JSON.stringify(filters.stores))}`;
    }

    if (filters.categories.length > 0) {
        queryString += `&categories=${encodeURIComponent(JSON.stringify(filters.categories))}`;
    }

    if (sortOrder) {
        queryString += `&sortOrder=${sortOrder}`;
    }

    if (searchKeyword) {
        queryString += `&searchKeyword=${encodeURIComponent(searchKeyword)}`;
    }

    $.ajax({
        url: `http://localhost:8081/api/food-list${queryString}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response.dtoList;
            var total = response.total;
            var currentPage = response.page;
            $(".mb-3.mb-md-0 .text-dark").text(total);

            renderProducts(data);
            renderPagination(currentPage, total);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function renderProducts(data) {
    var $productContainer = $('#productContainer');
    $productContainer.empty();
    var productHtml = '';

    var filters = getSelectedFilters();
    var filteredProductCount = 0;

    $.each(data, function(index, product) {
        var festivalText, festivalColor;

        filteredProductCount++;

        if (product.productEvent === 1) {
            festivalText = '신상품';
            festivalColor = 'pink';
        } else if (product.productEvent === 2) {
            festivalText = '1+1';
            festivalColor = 'purple';
        } else if (product.productEvent === 3) {
            festivalText = '2+1';
            festivalColor = 'orange';
        } else {
            festivalText = '';
            festivalColor = '';
        }

        var fixedTag = JSON.parse(product.fixedTag).smallCategory;

        var isActive = product.saved === 1 ? 'active' : '';
        var bookmarkIcon = product.saved === 1 ? 'bi-bookmark-fill' : 'bi-bookmark';

        var truncatedProductName = truncateString(product.productName, 15);

        productHtml += `
            <div class="col">
              <div class="card card-product">
                <div class="card-body">
                  <div class="text-center position-relative">
                    <div class=" position-absolute top-0 start-0">
                      <span class="badge bg-${festivalColor}">${festivalText}</span>
                    </div>
                    <a href="viewFood?productId=${product.productId}">
                        <img class="mb-3 img-fluid" style="max-width: 220px; height: 220px;" src="${product.productImg}">
                    </a>
                  </div>
                  <div class="text-small mb-1"><a href="#" class="text-decoration-none text-muted">${fixedTag}</a></div>
                  <h2 class="fs-6" title="${product.productName}"><a href="viewFood?productId=${product.productId}" class="text-inherit text-decoration-none">${truncatedProductName}</a></h2>
                  <div>
                    <small class="text-warning"><i class="bi bi-star-fill"></i></small>
                    <span class="text-muted small">조회(<span>${product.productViews}</span>)</span>
                    <small class="text-warning"><i class="bi bi-star-fill"></i></small>
                    <span class="text-muted small">리뷰(<span>${product.productReviews}</span>)</span>
                    <small class="text-warning"><i class="bi bi-star-fill"></i></small>
                    <span class="text-muted small" id="product-saved-${product.productId}">찜(${product.productSaved})</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <div></div>
                    <div>
                      <span class="text-dark">${product.productPrice.toLocaleString('ko-KR')}원</span>
                      
                      <a href="#" class="ms-2 btn-action ${isActive}" style="color: deeppink" id="product-save" data-product-id="${product.productId}"><i class="${bookmarkIcon}"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
    });

    var productListHtml = `
      <div class="row g-4 row-cols-xl-5 row-cols-lg-3 row-cols-2 row-cols-md-2 mt-2">
        ${productHtml}
      </div>
    `;

    $productContainer.append(productListHtml);
}

function renderPagination(currentPage, totalItems) {
    var totalPages = Math.ceil(totalItems / 15);
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
            loadProducts(pageNumber, $(".form-select").val());
        }
    });
}

$(document).ready(function () {
    loadProducts(1, $(".form-select").val());
});

$(document).on("click", "#product-save", function(e) {
    productSaved.call(this, e);
});

// 상품 찜 토글
async function productSaved(e) {
    e.preventDefault();
    e.stopPropagation();

    const loginUser = await getUserInfo();
    var userId = loginUser ? loginUser.userId : null;

    const productId = $(this).data("product-id");

    const sendData = { // 데이터 저장 및 삭제에 필요한 정보
        userId: userId,
        productId: productId
    };

    $(this).toggleClass('active'); // 토글 활성화
    if ($(this).hasClass('active')) {  // 토글 활성화시 데이터 저장
        $(this).find('i').removeClass('bi-bookmark').addClass('bi-bookmark-fill');
        const response = await fetch('http://localhost:8081/products/'+sendData.productId+'/saved', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        });

        const responseData = await response.json();
        const savedCount = responseData.savedCount;
        $(`#product-saved-${productId}`).text(`찜(${savedCount})`);

        return responseData
    } else { // 토글 비활성화시 데이터 삭제
        $(this).find('i').removeClass('bi-bookmark-fill').addClass('bi-bookmark');
        const response = await fetch('http://localhost:8081/products/'+sendData.productId+'/saved/'+sendData.userId, {
            method:'DELETE'
        });

        const responseData = await response.json();
        const savedCount = responseData.savedCount;
        $(`#product-saved-${productId}`).text(`찜(${savedCount})`);

        return responseData
    }
};