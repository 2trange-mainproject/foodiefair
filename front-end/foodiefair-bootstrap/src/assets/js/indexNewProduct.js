$(document).ready(function () {
    loadProducts("CU");

    $(".CU").on("click", function () {
        loadProducts("CU");
    });

    $(".GS25").on("click", function () {
        loadProducts("GS25");
    });

    $(".Emart24").on("click", function () {
        loadProducts("Emart24");
    });

    $(".sevenElven").on("click", function () {
        loadProducts("7ELVEN");
    });
});

function loadProducts(storeCode) {
    let filters = {
        stores: [storeCode],
        events: [1]
    };

    let queryString = "?page=1&size=15";

    if (filters.stores.length > 0) {
        queryString += `&stores=${encodeURIComponent(JSON.stringify(filters.stores))}`;
    }

    if (filters.events.length > 0) {
        queryString += `&events=${encodeURIComponent(JSON.stringify(filters.events))}`;
    }

    $.ajax({
        url: `http://localhost:8081/api/event-list${queryString}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let data = response.dtoList;
            renderNewProducts(data);
            if ($('#newProductContainer').hasClass('slick-initialized')) {
                $('#newProductContainer').slick('refresh');
            } else {
                initSlider();
            }
        },


        error: function (error) {
            console.log(error);
        },
    });
}

function initSlider() {
    $('#newProductContainer').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
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

        productHtml += `
                <div class="item">
                  <div class="card card-product h-100 mb-4">
                    <div class="card-body position-relative">
                      <div class="text-center position-relative">
                        <div class=" position-absolute top-0 start-0">
                          <span class="badge bg-pink">신상품</span>
                        </div>
                        <a href="shop-single.html?productId=${product.productId}">
                          <img class="mb-3 img-fluid" style="max-width: 220px; max-height: 220px;" src="${product.productImg}">
                        </a>
                      </div>
                      <div class="text-small mb-1"><a href="#" class="text-decoration-none text-muted">${fixedTag}</a></div>
                      <h2 class="fs-6"><a href="shop-single.html?productId=${product.productId}" class="text-inherit text-decoration-none">${product.productName}</a></h2>
                      <div>
                        <small class="text-warning"><i class="bi bi-star-fill"></i></small>
                        <span class="text-muted small">조회(<span>${product.productViews}</span>)</span>
                        <small class="text-warning"><i class="bi bi-star-fill"></i></small>
                        <span class="text-muted small">리뷰(<span>${product.productReviews}</span>)</span>
                        <small class="text-warning"><i class="bi bi-star-fill"></i></small>
                        <span class="text-muted small">찜(<span>${product.productSaved}</span>)</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mt-3">
                        <div></div>
                        <div>
                          <span class="text-dark">${product.productPrice}원</span>
                          <a href="#" class="ms-2 btn-action" style="color: deeppink"><i class="bi bi-bookmark"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
          `;
    });
    $newProductContainer.append(productHtml);

}
