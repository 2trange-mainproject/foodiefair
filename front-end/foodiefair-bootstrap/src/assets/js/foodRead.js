$(document).ready(function () {
    var productId = getProductIdFromUrl();
    loadProductDetails(productId);

    productReviewsRead();

    //두 줄 뜨는 보기 안 좋은 것을 가리기 위함
    $("#food_preview").attr("src", "").css("display", "none");
    $("#OCR_preview").attr("src", "").css("display", "none");
});

function getProductIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("productId");
}

async function loadProductDetails(productId) {
    let queryString = `?productId=${productId}`;

    const loginUser = await getUserInfo();
    let userId = loginUser ? loginUser.userId : null;

    if (userId) {
        queryString += `&userId=${userId}`;
    }

    $.ajax({
        url: `https://115.85.182.117/api/product-read${queryString}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            renderProductDetails(response.productRead);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function renderProductDetails(product) {
    var $productContainer = $('#productContainer');
    $productContainer.empty();
    var productHtml = '';

    var festivalText;

    if (product.productEvent === 1) {
        festivalText = '신상품';
    } else if (product.productEvent === 2) {
        festivalText = '1+1';
    } else if (product.productEvent === 3) {
        festivalText = '2+1';
    } else {
        festivalText = '';
    }

    var fixedTagStore = JSON.parse(product.fixedTag).store;
    var fixedTagBig = JSON.parse(product.fixedTag).bigCategory;
    var fixedTagSmall = JSON.parse(product.fixedTag).smallCategory;

    var isActive = product.saved === 1 ? 'active' : '';
    var bookmarkIcon = product.saved === 1 ? 'bi-bookmark-fill' : 'bi-bookmark';

    productHtml += `
  <div class="mt-4">
    <div class="container">
      <!-- row -->
      <div class="row ">
        <!-- col -->
        <div class="col-12">
          <!-- breadcrumb -->
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="javascript:void(0);" onclick="window.history.back();" style="color: deeppink">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">${fixedTagBig}</li>
              <li class="breadcrumb-item active" aria-current="page">${fixedTagSmall}</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>
  <section class="mt-8">
    <div class="container">
      <div class="row">

        <div class="col-md-6">
          <!-- img slide -->
          <div class="product">
          <img src="${product.productImg}" style="max-width: 546px; height: 546px; margin-left: 20px">
            
          </div>
        </div>
        <div class="col-md-6">
          <div class="ps-lg-10 mt-6 mt-md-0">
            <!-- content -->
            <a href="#!" style="color: deeppink" class="mb-4 d-block">${fixedTagBig}</a>
            <!-- heading -->
            <h1 class="mb-1" id="product-name" data-productId="${product.productId}">${product.productName} <a href="#" class="ms-2 btn-action ${isActive}" style="color: deeppink" id="product-save" data-product-id="${product.productId}"><i class="${bookmarkIcon}"></i></a></h1>
            <div class="mb-4">
              <!-- rating -->
              <a href="#" class="ms-2" style="color: deeppink" id="product-review">(리뷰 개수 ${product.productReviews})</a>
              <a href="#" class="ms-2" style="color: deeppink" id="product-saved">(찜 개수 ${product.productSaved})</a>
              <a href="#" class="ms-2" style="color: deeppink">(조회수 ${product.productViews})</a>
            </div>
            <div class="fs-4">
              <!-- price -->
              <span class="fw-bold text-dark" id="product-price">${product.productPrice.toLocaleString('ko-KR')}원</span>
            </div>

            <hr class="my-6">
            <div>
              <!-- table -->
              <table class="table table-borderless mb-0">

                <tbody>
                <tr>
                  <td>편의점:</td>
                  <td>${fixedTagStore}</td>
                </tr>
                <tr>
                  <td>카테고리:</td>
                  <td>${fixedTagSmall}</td>
                </tr>
                <tr>
                  <td>이벤트:</td>
                  <td>${festivalText}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
          `;

    var productListHtml = `
            ${productHtml}
    `;

    $productContainer.append(productListHtml);

    $('#product-save').on('click', productSaved);
}

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
            timer: 1300,
        });
        return;
    }

    var userId = loginUser ? loginUser.userId : null;

    const sendData = { // 데이터 저장 및 삭제에 필요한 정보
        userId: userId,
        productId: await $('#product-name').attr('data-productId')
    };

    $(this).toggleClass('active'); // 토글 활성화
    if ($(this).hasClass('active')) {  // 토글 활성화시 데이터 저장
        $(this).find('i').removeClass('bi-bookmark').addClass('bi-bookmark-fill');
        const response = await fetch('https://115.85.182.117/products/'+sendData.productId+'/saved', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        });

        const responseData = await response.json();
        const savedCount = responseData.savedCount;
        $("#product-saved").text(`(찜 개수 ${savedCount})`);

        const data = await response.text();
        return data
    } else { // 토글 비활성화시 데이터 삭제
        $(this).find('i').removeClass('bi-bookmark-fill').addClass('bi-bookmark');
        const response = await fetch('https://115.85.182.117/products/'+sendData.productId+'/saved/'+sendData.userId, {
            method:'DELETE'
        });

        const responseData = await response.json();
        const savedCount = responseData.savedCount;
        $("#product-saved").text(`(찜 개수 ${savedCount})`);

        const data = await response.text();
        return data
    }
};
