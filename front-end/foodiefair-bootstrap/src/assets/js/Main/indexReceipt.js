async function loadReceipts(page, sortOrder) {
    var userId = null;

    // food.html 페이지의 JavaScript 코드
    const searchKeyword = localStorage.getItem('searchKeyword');

    var queryString = `?page=${page}&size=15&sortOrder=highReviewNum`;

    if (userId) {
        queryString += `&userId=${userId}`;
    }

    if (searchKeyword) {
        queryString += `&searchKeyword=${encodeURIComponent(searchKeyword)}`;
    }

    $.ajax({
        url: `https://115.85.182.117/api/food-list${queryString}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response.dtoList;

            renderReceipts(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function renderReceipts(data) {
    var $receiptContainer = $('#receiptContainer');
    $receiptContainer.empty();
    var receiptHtml = '';

    $.each(data, function(index, receipt) {
        if (index < 3) {
            receiptHtml += `
            <a href="pages/viewFood?productId=${receipt.productId}">
                <img src="${receipt.productImg}" class="circle-img">
            </a>
        `;
        } else {
            return false;
        }
    });

    var receiptListHtml = `
        ${receiptHtml}
    `;

    $receiptContainer.append(receiptListHtml);
}

$(document).ready(function () {
    loadReceipts(1, $(".form-select").val());
});
