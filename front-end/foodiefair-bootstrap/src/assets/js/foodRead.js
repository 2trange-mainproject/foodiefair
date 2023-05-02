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
        url: `http://localhost:8081/api/product-read/${productId}`,
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
              <li class="breadcrumb-item"><a href="#" style="color: deeppink">Home</a></li>
              <li class="breadcrumb-item"><a href="#" style="color: deeppink">${fixedTagBig}</a></li>
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
          <img src="${product.productImg}" style="min-width: 546px; margin-left: 20px">
            
          </div>
        </div>
        <div class="col-md-6">
          <div class="ps-lg-10 mt-6 mt-md-0">
            <!-- content -->
            <!-- heading -->
            <h1 class="mb-1">${product.productName}<a href="#" class="ms-2 btn-dib" style="color: deeppink"><i class="bi bi-bookmark"></i></a></h1>
            <div class="mb-4">
              <!-- rating -->
              <a href="#" class="ms-2" style="color: deeppink" id="product-review"></a>
              <a href="#" class="ms-2" style="color: deeppink" id="product-saved"></a>
            </div>
            <div class="fs-4">
              <!-- price --><span class="fw-bold text-dark" id="product-price"></span>
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
}