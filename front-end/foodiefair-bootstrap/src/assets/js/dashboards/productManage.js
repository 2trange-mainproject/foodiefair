// 검색 폼 이벤트 리스너 추가
$("#searchForm").on("submit", function (event) {
    event.preventDefault();
    var keyword = $("#searchInput").val();
    loadProducts(1, null, keyword);
});

$(".form-select").on("change", function() {
    loadProducts(1, $(this).val());
});

$(document).on("click", ".delete-product", function (event) {
    event.preventDefault();
    var productId = $(this).data("product-id");
    deleteProduct(productId);
});

function deleteProduct(productId) {
    if (!confirm("정말로 이 상품을 삭제하시겠습니까?")) {
        return;
    }

    $.ajax({
        url: `http://localhost:8081/dashboard/product-delete/${productId}`,
        type: "DELETE",
        success: function (response) {
            alert("상품이 삭제되었습니다.");
            loadProducts(1);
        },
        error: function (error) {
            console.log(error);
            alert("상품 삭제에 실패하였습니다.");
        },
    });
}

function loadProducts(page, sortOrder) {
    var queryString = `?page=${page}&size=12`;

    if (sortOrder) {
        queryString += `&sortOrder=${sortOrder}`;
    }

    $.ajax({
        url: `http://localhost:8081/dashboard/product-list${queryString}`,
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

        var fixedTagObj = JSON.parse(product.fixedTag);
        var fixedTag = `${fixedTagObj.store}, ${fixedTagObj.bigCategory}, ${fixedTagObj.smallCategory}`;

        var releaseDate = new Date(product.releaseDate).toISOString().split('T')[0];

        productHtml += `
                      <tr>
                        <td>
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="productOne">
                            <label class="form-check-label" for="productOne">
                            </label>
                          </div>
                        </td>
                        <td>
                          <a href="read-product.html?productId=${product.productId}"> <img src="${product.productImg}" class="icon-shape icon-md"></a>
                        </td>
                        <td><a href="read-product.html?productId=${product.productId}" style="color: black">${product.productName}</a></td>
                        <td><a href="read-product.html?productId=${product.productId}" style="color: black">${fixedTag}</a></td>
                        <td><a href="read-product.html?productId=${product.productId}" style="color: black">${product.productPrice}</a></td>
                        <td><a href="read-product.html?productId=${product.productId}" style="color: black">${releaseDate}</a></td>
                        <td><a href="read-product.html?productId=${product.productId}" style="color: black">${festivalText}</a></td>
                        <td><a href="read-product.html?productId=${product.productId}" style="color: black">${product.productId}</a></td>
                        <td>
                          <div class="dropdown">
                            <a href="#" class="text-reset" data-bs-toggle="dropdown" aria-expanded="false">
                              <i class="feather-icon icon-more-vertical fs-5"></i>
                            </a>
                            <ul class="dropdown-menu">
                              <li><a class="dropdown-item delete-product" href="#" data-product-id="${product.productId}"><i class="bi bi-trash me-3"></i>Delete</a></li>
                              <li><a class="dropdown-item" href="edit-product.html?productId=${product.productId}"><i class="bi bi-pencil-square me-3 "></i>Edit</a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
          `;
    });

    var productListHtml = `
        ${productHtml}
    `;

    $productContainer.append(productListHtml);
}

function renderPagination(currentPage, totalItems) {
    var totalPages = Math.ceil(totalItems / 12);

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
    for (var i = 1; i <= totalPages; i++) {
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
            loadProducts(pageNumber);
        }
    });
}

$(document).ready(function () {
    loadProducts(1);
});