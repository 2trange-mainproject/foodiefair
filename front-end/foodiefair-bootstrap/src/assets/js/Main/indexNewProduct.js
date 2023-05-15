//편의점별 탭 버튼 불렀을 때 상품 로드
$(document).ready(function () {
    loadProducts("CU");

    $(".CU").on("click", function () {
        loadProducts("CU");
    });

    $(".GS25").on("click", function () {
        loadProducts("GS25");
    });

    $(".Emart24").on("click", function () {
        loadProducts("이마트24");
    });

    $(".sevenEleven").on("click", function () {
        loadProducts("세븐일레븐");
    });
});

async function loadProducts(storeCode) {
    const loginUser = await getUserInfo();
    let userId = loginUser ? loginUser.userId : null;

    let filters = {
        stores: [storeCode],
        events: [1]
    };

    let queryString = "?page=1&size=15";

    if (userId) {
        queryString += `&userId=${userId}`;
    }

    if (filters.stores.length > 0) {
        queryString += `&stores=${encodeURIComponent(JSON.stringify(filters.stores))}`;
    }

    if (filters.events.length > 0) {
        queryString += `&events=${encodeURIComponent(JSON.stringify(filters.events))}`;
    }

    $.ajax({
        url: `https://www.foodiefair.shop/api/event-list${queryString}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let data = response.dtoList;
            if ($('#newProductContainer').hasClass('slick-initialized')) {
                $('#newProductContainer').slick('unslick');
            }
            renderNewProducts(data);
            initSlider();
        },

        error: function (error) {
            console.log(error);
        }
        ,
    });
}

// 탭 버튼 누를때마다 슬라이더 초기화 하기 위함
function initSlider() {
    $('#newProductContainer').slick({
        slidesToShow: 5, //한번에 5개씩 보여짐
        slidesToScroll: 1, //이동할 때 한번에 하나씩 이동
        autoplay: true, //자동
        autoplaySpeed: 2000,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button"><i class="feather-icon icon-chevron-left "></i></button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button"><i class="feather-icon icon-chevron-right "></i></button>',
    });
}

function renderNewProducts(data) {
    let $newProductContainer = $('#newProductContainer');
    $newProductContainer.empty();
    let productHtml = '';

    $.each(data, function (index, product) {
        let fixedTag = JSON.parse(product.fixedTag).smallCategory;

        var truncatedProductName = truncateString(product.productName, 15);

        var isActive = product.saved === 1 ? 'active' : '';
        var bookmarkIcon = product.saved === 1 ? 'bi-bookmark-fill' : 'bi-bookmark';

        productHtml += `
                <div class="item">
                  <div class="card card-product h-100 mb-4">
                    <div class="card-body position-relative">
                      <div class="text-center position-relative">
                        <div class=" position-absolute top-0 start-0">
                          <span class="badge bg-pink">신상품</span>
                        </div>
                        <a href="/pages/viewFood?productId=${product.productId}">
                          <img class="mb-3 img-fluid" style="max-width: 210px; height: 210px;" src="${product.productImg}">
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
    $newProductContainer.append(productHtml);

}
