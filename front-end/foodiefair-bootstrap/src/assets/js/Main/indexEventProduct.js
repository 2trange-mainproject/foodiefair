//편의점별 탭 버튼 불렀을 때 상품 로드
$(document).ready(function () {
    loadEventProducts("CU");

    $(".CU-3").on("click", function () {
        loadEventProducts("CU");
    });

    $(".GS25-3").on("click", function () {
        loadEventProducts("GS25");
    });

    $(".Emart24-3").on("click", function () {
        loadEventProducts("이마트24");
    });

    $(".sevenEleven-3").on("click", function () {
        loadEventProducts("세븐일레븐");
    });
});


async function loadEventProducts(storeCode) {
    const loginUser = await getUserInfo();
    let userId = loginUser ? loginUser.userId : null;

    let filters = {
        stores: [storeCode],
        events: [2, 3]
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
        url: `http://localhost:8081/api/event-list${queryString}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let data = response.dtoList;
            if ($('#eventProductContainer').hasClass('slick-initialized')) {
                $('#eventProductContainer').slick('unslick');
            }
            renderEventProducts(data);
            initEventSlider();
        },
        error: function (error) {
        },
    });
}

// 탭 버튼 누를때마다 슬라이더 초기화 하기 위함
function initEventSlider() {
    $('#eventProductContainer').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button"><i class="feather-icon icon-chevron-left "></i></button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button"><i class="feather-icon icon-chevron-right "></i></button>',
    });
}


function renderEventProducts(data) {
    let $eventProductContainer = $('#eventProductContainer');
    $eventProductContainer.empty();
    let productEventHtml = '';


    $.each(data, function (index, product) {

        let festivalText, festivalColor;
        if (product.productEvent === 2) {
            festivalText = '1+1';
            festivalColor = 'purple';
        } else if (product.productEvent === 3) {
            festivalText = '2+1';
            festivalColor = 'orange';
        }
        let fixedTag = JSON.parse(product.fixedTag).smallCategory;

        var truncatedProductName = truncateString(product.productName, 15);

        var isActive = product.saved === 1 ? 'active' : '';
        var bookmarkIcon = product.saved === 1 ? 'bi-bookmark-fill' : 'bi-bookmark';

        productEventHtml += `
                <div class="item">
                  <div class="card card-product h-100 mb-4">
                    <div class="card-body position-relative">
                      <div class="text-center position-relative">
                        <div class=" position-absolute top-0 start-0">
                          <span class="badge bg-${festivalColor}">${festivalText}</span>
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

    $eventProductContainer.append(productEventHtml);

}

$(document).on("click", "#product-save", function(e) {
    productSaved.call(this, e);
});

// 상품 찜 토글
async function productSaved(e) {
    e.preventDefault();
    e.stopPropagation();

    const loginUser = await getUserInfo();

    if(!loginUser){
        Swal.fire({
            title: "찜 실패",
            html: `로그인이 필요한 기능입니다.<br> 로그인 후 다시 시도해주세요.`,
            icon: "warning",
            showConfirmButton: false,
            timer: 1200,
        });
        return;
    }

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
