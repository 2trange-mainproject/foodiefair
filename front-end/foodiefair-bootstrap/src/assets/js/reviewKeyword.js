function getKeywordIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("productId");
}

function loadKeywords(productId) {
    var productId = getKeywordIdFromUrl();

    $.ajax({
        url: `http://localhost:8081/api/keyword/${productId}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response.dtoList;

            renderKeywords(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function renderKeywords(data) {
    var $keywordContainer = $('#keywordContainer');
    $keywordContainer.empty();
    var keywordHtml = '';

    $.each(data, function(index, keyword) {
        var positiveKeywords = JSON.parse(keyword.positiveKeyword);
        var negativeKeywords = JSON.parse(keyword.negativeKeyword);

        var positiveHtml = '';
        var negativeHtml = '';

        for (const key in positiveKeywords) {
            if (positiveKeywords.hasOwnProperty(key)) {
                positiveHtml += `
                <div class="row-4 d-flex justify-content-between">
                  <span class="fs-5 fw-bold">${key}</span>
                  <span>${positiveKeywords[key]}</span>
                </div>
                `;
            }
        }

        for (const key in negativeKeywords) {
            if (negativeKeywords.hasOwnProperty(key)) {
                negativeHtml += `
                <div class="row-4 d-flex justify-content-between">
                  <span class="fs-5 fw-bold">${key}</span>
                  <span>${negativeKeywords[key]}</span>
                </div>
                `;
            }
        }

        keywordHtml += `
        <div class="row justify-content-evenly">
            <div class="col-4">
                <div class="mb-2">
                    <h3 class="text-pink"><i class="bi-emoji-heart-eyes me-2"></i>Good</h3>
                </div>
                ${positiveHtml}
            </div>
            <div class="col-4">
                <div class="mb-2">
                    <h3 class="text-warning"><i class="bi-emoji-frown me-2"></i>Bad</h3>
                </div>
                ${negativeHtml}
            </div>
        </div>
        `;
    });

    var keywordListHtml = `
    <div class="container mt-12">
        ${keywordHtml}
    </div>
    `;

    $keywordContainer.append(keywordListHtml);
}

$(document).ready(function () {
    loadKeywords(1);
});