function getKeywordIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("productId");
}

let foodImage = null;
let receiptImage = null;

function foodURL(input) {
    if (input.files && input.files[0]) {
        foodImage = input.files[0];
        let reader = new FileReader();
        reader.onload = async function (e) {
            document.getElementById('food_preview').src = e.target.result;

        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('food_preview').src = "";
    }
}

function readURL(input) {
    if (input.files && input.files[0]) {
        receiptImage = input.files[0];
        let reader = new FileReader();
        reader.onload = async function (e) {
            document.getElementById('OCR_preview').src = e.target.result;

            const base64Data = e.target.result.split(',')[1];

            const response = await requestWithBase64(base64Data);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('OCR_preview').src = "";
    }
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
    Dropzone.forElement("#receiptImgDropzone").removeAllFiles(true);
    Dropzone.forElement("#foodImgDropzone").removeAllFiles(true);
});

//----------------등록 버튼------------------
$("#review-enroll").on('click', function(e) {
    e.preventDefault(); // 기본 이벤트 실행 막기

    var userId = 35;
    // 입력된 정보 가져오기
    var productId = getProductIdFromUrl();
    var goodReviews = $("#good-review").val().trim();
    var badReviews = $("#bad-review").val().trim();
    // receiptImgDropzone.files 배열의 길이가 0인 경우 파일이 선택되지 않았음을 의미합니다.
    var receiptImg = receiptImage;
    var reviewImg = foodImage;

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

//영수증
async function requestWithBase64(base64Data) {
    const url = "http://localhost:8081/api/receipt/";
    const data = {
        image: base64Data
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const jsonResponse = await response.json();
        console.log(jsonResponse);
        ocrConfirmModal(jsonResponse);

    } catch (error) {
        console.log('Error processing request:', error);
    }
}

function ocrConfirmModal(jsonResponse) {
    let OCRContainer = $('#OCRContainer');
    OCRContainer.empty();
    let ocrModal = '';
    if (jsonResponse.status === 'success') {
        ocrModal += `
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Receipt authentication succeeded</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    Authentication succeeded
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>`;
    } else {
        ocrModal += `
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Receipt authentication failed</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    영수증 인증을 실패했습니다.</br>
                    [인증 실패]</br>
                    올바른 영수증인지 다시 확인 해주세요.</br>
                    해당 상품의 영수증이 아닐 수 있습니다.</br>
                    영수증이 훼손된 경우, 정확한 판독이 어렵습니다.</br>
                    자세한 사항은 문의사항을 통해 문의해주세요.
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>`;
    }
    OCRContainer.append(ocrModal);
}