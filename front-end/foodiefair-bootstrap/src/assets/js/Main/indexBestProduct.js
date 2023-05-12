//편의점별 탭 버튼 불렀을 때 상품 로드
$(document).ready(function () {
    loadBestProducts("CU", 'popularity');

    $(".CU-2").on("click", function () {
        loadBestProducts("CU", 'popularity');
    });

    $(".GS25-2").on("click", function () {
        loadBestProducts("GS25", 'popularity');
    });

    $(".Emart24-2").on("click", function () {
        loadBestProducts("이마트24", 'popularity');
    });

    $(".sevenEleven-2").on("click", function () {
        loadBestProducts("세븐일레븐", 'popularity');
    });
});

function loadBestProducts(storeCode, sortOrder) {
    let filters = {
        stores: [storeCode],
        sortOrder: sortOrder
    };

    let queryString = "?page=1&size=15";

    if (filters.stores.length > 0) {
        queryString += `&stores=${encodeURIComponent(JSON.stringify(filters.stores))}`;
    }
    if (filters.sortOrder) {
        queryString += `&sortOrder=${filters.sortOrder}`;
    }


    $.ajax({
        url: `http://localhost:8081/api/food-list${queryString}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let data = response.dtoList;
            if ($('#bestProductContainer').hasClass('slick-initialized')) {
                $('#bestProductContainer').slick('unslick');
            }
            renderBestProducts(data);
            initBestSlider();
        },
        error: function (error) {
            console.log(error.responseText);
        },
    });
}

// 탭 버튼 누를때마다 슬라이더 초기화 하기 위함
function initBestSlider() {
    $('#bestProductContainer').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button"><i class="feather-icon icon-chevron-left "></i></button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button"><i class="feather-icon icon-chevron-right "></i></button>',
    });
}

function renderBestProducts(data) {
    let bestProductContainer = $('#bestProductContainer');
    bestProductContainer.empty();
    let productBestHtml = '';


    $.each(data, function(index, product) {
        let festivalText, festivalColor;

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

        let fixedTag = JSON.parse(product.fixedTag).smallCategory;

        productBestHtml += `
            <div class="col">
              <div class="card card-product">
                <div class="card-body">
                  <div class="text-center position-relative">
                    <div class=" position-absolute top-0 start-0">
                      <span class="badge bg-${festivalColor}">${festivalText}</span>
                    </div>
                    <a href="/pages/viewFood?productId=${product.productId}">
<<<<<<< HEAD
                        <img class="mb-3 img-fluid" style="height: 220px;" src="${product.productImg}">
=======
                        <img class="mb-3 img-fluid" style="max-width: 210px; height: 210px;" src="${product.productImg}">
>>>>>>> 33e51f6d6538c8073cbe5e892a08729b2dc8613a
                    </a>
                  </div>
                  <div class="text-small mb-1"><a href="#" class="text-decoration-none text-muted">${fixedTag}</a></div>
                  <h2 class="fs-6"><a href="viewFood?productId=${product.productId}" class="text-inherit text-decoration-none">${product.productName}</a></h2>
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
                      <a href="#" class="ms-2 btn-action" style="color: deeppink" id="product-save" data-product-id="${product.productId}"><i class="bi bi-bookmark"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
    });

    bestProductContainer.append(productBestHtml);
}
