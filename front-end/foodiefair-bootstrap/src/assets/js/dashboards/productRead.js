$(document).ready(function () {
    var productId = getProductIdFromUrl();
    loadProductDetails(productId);
});

function getProductIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("productId");
}

function loadProductDetails(productId) {
    $.ajax({
        url: `http://localhost:8081/dashboard/product-read/${productId}`,
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

    var fixedTagObj = JSON.parse(product.fixedTag);
    var fixedTag = `${fixedTagObj.store}, ${fixedTagObj.bigCategory}, ${fixedTagObj.smallCategory}`;

    var releaseDate = new Date(product.releaseDate).toISOString().split('T')[0];

    productHtml += `
          <div class="col-12">
            <!-- card -->
            <div class="card mb-6 card-lg">
              <!-- card body -->
              <div class="card-body p-6 ">
                <div class="row">
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">상품 ID</label>
                    <input type="text" class="form-control" value="${product.productId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">상품명</label>
                    <input type="text" class="form-control" value="${product.productName}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">상품 가격</label>
                    <input type="text" class="form-control" value="${product.productPrice}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">행사 정보</label>
                    <input type="text" class="form-control" value="${festivalText}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3">
                    <label class="form-label">상품 태그</label>
                    <input type="text" class="form-control" value="${fixedTag}" disabled>
                  </div>
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">등록일자</label>
                    <input type="text" class="form-control" value="${releaseDate}" disabled>
                  </div>
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">조회수</label>
                    <input type="text" class="form-control" value="${product.productViews}" disabled>
                  </div>
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">리뷰개수</label>
                    <input type="text" class="form-control" value="${product.productReviews}" disabled>
                  </div>
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">찜개수</label>
                    <input type="text" class="form-control" value="${product.productSaved}" disabled>
                  </div>
                  <label class="form-label">상품 사진</label>
                  <div class="mb-3 col-lg-6">
                    <!-- input -->
                    <img src="${product.productImg}" class="mb-3 img-fluid">
                  </div>
                </div>
                <div class="d-flex justify-content-end" style="padding-top: 10px">
                  <a href="edit-product.html?productId=${product.productId}" class="btn btn-soft-pink btn-sm" style="font-size: 16px;">
                    상품 수정하기
                  </a>
                </div>
              </div>
            </div>
          </div>
          `;

    var productListHtml = `
        <div class="row">
            ${productHtml}
        </div>
    `;

    $productContainer.append(productListHtml);
}