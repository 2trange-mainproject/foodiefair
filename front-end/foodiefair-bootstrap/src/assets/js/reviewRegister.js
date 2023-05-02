function getKeywordIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("productId");
}

// Create Dropzone instances for foodImgDropzone and receiptImgDropzone
const foodImgDropzone = new Dropzone("#foodImgDropzone", {
    url: "http://localhost:8081/api/review-add",
    autoProcessQueue: false,
});

const receiptImgDropzone = new Dropzone("#receiptImgDropzone", {
    url: "http://localhost:8081/api/review-add",
    autoProcessQueue: false,
});

// Add a click event listener for the '등록' button
document.getElementById("review-enroll").addEventListener("click", function (event) {
    event.preventDefault();

    // Process the file upload queues for both Dropzone instances
    foodImgDropzone.processQueue();
    receiptImgDropzone.processQueue();

    // Add your additional form submission logic here
});

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

//키워드 보여주는 함수
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

//----------------취소 버튼-------------------
$("#review-reset").on("click", function(e) {
    e.preventDefault(); // 기본 이벤트 실행 막기

    // 리뷰 정보 초기화
    $("#good-review").val('');
    $("#bad-review").val('');

    //Dropzone 초기화
    Dropzone.forElement("#receiptImg").removeAllFiles(true);
    Dropzone.forElement("#foodImg").removeAllFiles(true);
});

//----------------등록 버튼------------------
$("#review-enroll").on('click', function(e) {
    e.preventDefault(); // 기본 이벤트 실행 막기

    var userId = 35;
    // 입력된 정보 가져오기
    var productId = getProductIdFromUrl();
    var goodReviews = $("#good-review").val().trim();
    var badReviews = $("#bad-review").val().trim();
    //var receiptImg = $("#receiptImg")[0].files[0];
    //var reviewImg = $("#foodImg")[0].files[0];
    var receiptImg = 0;
    var reviewImg = "none.jpg";

    // FormData 객체 생성
    var formData = new FormData();
    formData.append("productId", productId);
    formData.append("userId", userId);
    formData.append("goodReviews", goodReviews);
    formData.append("badReviews", badReviews);
    formData.append("receiptImg", receiptImg);
    formData.append("reviewImg", reviewImg);

    // Ajax를 이용해 서버로 정보 전송
    $.ajax({
        type: "POST",
        url: "http://localhost:8081/api/review-add",
        processData: false, // 필수: FormData 사용 시 false로 설정
        contentType: false, // 필수: FormData 사용 시 false로 설정
        data: formData,
        success: function(response) {
            console.log(response);
            loadKeywords(productId);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        },
    });
});