$(document).ready(function () {
    var productId = getProductIdFromUrl();
    loadProductDetails(productId);

    $(document).on('click', '#update-product', function () {
        updateProduct(productId);
    });
});

function getProductIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("productId");
}

function tagsToJson(tagString) {
    const keys = ["store", "bigCategory", "smallCategory"];
    const tags = tagString.split(',').map(tag => tag.trim());
    const jsonTags = {};

    keys.forEach((key, index) => {
        if (tags[index]) {
            jsonTags[key] = tags[index];
        }
    });

    return JSON.stringify(jsonTags);
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

    var festivalOptions = `
        <option value="0">정보 선택</option>
        <option value="1">신상품</option>
        <option value="2">1 + 1</option>
        <option value="3">2 + 1</option>
    `;

    festivalOptions = festivalOptions.replace(`value="${product.productEvent}"`, `value="${product.productEvent}" selected`);


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
                    <input type="text" class="form-control" id="product-id" value="${product.productId}" disabled>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">상품명</label>
                    <input type="text" class="form-control" id="product-name" value="${product.productName}" required>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">상품 가격</label>
                    <input type="text" class="form-control" id="product-price" value="${product.productPrice}" required>
                  </div>
                  <!-- input -->
                  <div class="mb-3 col-lg-6">
                    <label class="form-label">행사 정보</label>
                    <select class="form-select" id="product-festival">
                        ${festivalOptions}
                    </select>
                  </div>
                  <!-- input -->
                  <div class="mb-3">
                    <label class="form-label">상품 태그</label>
                    <input type="text" class="form-control" id="product-tag" value="${fixedTag}" required>
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
                  <a href="#" class="btn btn-soft-pink btn-sm" style="font-size: 16px;" id="update-product">
                    상품 수정 완료
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

function updateProduct(productId){
    // 입력된 정보 가져오기
    var updatedProductName = $("#product-name").val();
    var updatedProductPrice = $("#product-price").val();
    var updatedProductFestival = $("#product-festival").val();
    var updatedProductTag = $("#product-tag").val();
    var updatedProductTagJson = tagsToJson(updatedProductTag);

    $.ajax({
        url: `http://localhost:8081/dashboard/product-update/${productId}`,
        type: "PUT",
        dataType: "text",
        data: {
            updatedProductName: updatedProductName,
            updatedProductPrice: updatedProductPrice,
            updatedProductFestival: updatedProductFestival,
            updatedProductTagJson: updatedProductTagJson
        },
        success: function (response) {
            alert('상품이 성공적으로 수정되었습니다.');
            window.location.href = 'read-product.html?productId=' + productId;
        },
        error: function (error) {
            console.log(error);
            alert('상품 수정에 실패했습니다. 다시 시도해주세요.');
        },
    });
}