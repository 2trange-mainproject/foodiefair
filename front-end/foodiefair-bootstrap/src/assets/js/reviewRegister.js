function getKeywordIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("productId");
}

var productId = getKeywordIdFromUrl();

let foodImage = null;
let receiptImage = null;

function loadKeywords(productId) {
    $.ajax({
        url: `https://115.85.182.117/api/keyword/${productId}`,
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

    if (data.length === 0) {
        keywordHtml = `
        <div class="row justify-content-evenly">
            <div class="col-4">
                <div class="mb-2">
                    <h3 class="text-pink"><i class="bi-emoji-heart-eyes me-2"></i>Good</h3>
                    <p>앗, 아직 리뷰가 없네요!</p>
                </div>
            </div>
            <div class="col-4">
                <div class="mb-2">
                    <h3 class="text-warning"><i class="bi-emoji-frown me-2"></i>Bad</h3>
                    <p>첫 키워드의 주인공이 되어보세요!</p>
                </div>
            </div>
        </div>
        `;
    } else {
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
    }

    var keywordListHtml = `
    <div class="container mt-12">
        ${keywordHtml}
    </div>
    `;

    $keywordContainer.append(keywordListHtml);
}

$(document).ready(function () {
    loadKeywords(productId);
});

// 등록 버튼을 비활성화
$("#review-enroll").addClass("disabled");

// textarea 값이 변경될 때마다 검사하는 이벤트 핸들러
$("#good-review, #bad-review").on('input', function() {
    var goodReview = $("#good-review").val().trim();
    var badReview = $("#bad-review").val().trim();

    // 두 textarea 필드가 모두 채워져 있고, 각각의 길이가 20자 이상인 경우 등록 버튼을 활성화
    if(goodReview.length >= 20 && badReview.length >= 20) {
        $("#review-enroll").removeClass("disabled");
        $('#review-update').removeClass('disabled');
    } else {
        // 둘 중 하나라도 내용이 없거나, 20자 미만일 경우 등록 버튼을 비활성화
        $("#review-enroll").addClass("disabled");
        $('#review-update').addClass('disabled');
    }
});

//----------------취소 버튼-------------------
$("#review-reset").on("click", function(e) {
    e.preventDefault(); // 기본 이벤트 실행 막기

    // 리뷰 정보 초기화
    $("#good-review").val('');
    $("#bad-review").val('');

    //사진 초기화
    $("#food_preview").attr("src", "").css("display", "none");
    $("#OCR_preview").attr("src", "").css("display", "none");

    // 파일 input 값 초기화
    $("#food_file").val('');
    $("#OCR_file").val('');

    // 이미지 변수 초기화
    foodImage = null;
    receiptImage = null;
});

//----------------등록 버튼------------------
//등록 버튼 클릭 이벤트 함수 정의
async function clickHandler(e) {
    // 버튼이 비활성화된 경우 클릭 이벤트를 중지
    if ($("#review-enroll").hasClass("disabled")) {
        e.preventDefault(); // 기본 이벤트 실행 막기
        return;
    }

    e.preventDefault(); // 기본 이벤트 실행 막기

    // 버튼 비활성화
    $(this).addClass("disabled");
    $(this).off('click');

    const loginUser = await getUserInfo();

    if(!loginUser){
        Swal.fire({
            title: "등록 실패",
            html: `로그인이 필요한 기능입니다.<br> 로그인 후 다시 시도해주세요.`,
            icon: "warning",
            showConfirmButton: false,
            timer: 1200,
        });
        return;
    }

    var userId = loginUser.userId;
    // 입력된 정보 가져오기
    var productId = getProductIdFromUrl();
    var goodReviews = $("#good-review").val().trim();
    var badReviews = $("#bad-review").val().trim();

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
        url: "https://115.85.182.117/api/review-add",
        processData: false, // 필수: FormData 사용 시 false로 설정
        contentType: false, // 필수: FormData 사용 시 false로 설정
        data: formData,
        success: function(response) {
            console.log(response);
            loadKeywords(productId);

            $("#product-review").text(`(리뷰 개수 ${response.reviewCount})`);

            // 리뷰 정보 초기화
            $("#good-review").val('');
            $("#bad-review").val('');

            //사진 초기화
            $("#food_preview").attr("src", "").css("display", "none");
            $("#OCR_preview").attr("src", "").css("display", "none");

            // 파일 input 값 초기화
            $("#food_file").val('');
            $("#OCR_file").val('');

            // 이미지 변수 초기화
            foodImage = null;
            receiptImage = null;

            $('#review-section').empty();
            pageOffset.init();
            productReviewsRead(e);
            $(window).scrollTop($('#receipt-reviews-tab').position().top);

            // 버튼 다시 활성화
            $("#review-enroll").removeClass("disabled");
            $("#review-enroll").on('click', clickHandler);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            Swal.fire({
                title: "등록 실패",
                html: `이미 리뷰를 작성하셨습니다.`,
                icon: "warning",
                showConfirmButton: false,
                timer: 1200,
            });
            // 버튼 다시 활성화
            $("#review-enroll").removeClass("disabled");
            $("#review-enroll").on('click', clickHandler);

            // 리뷰 정보 초기화
            $("#good-review").val('');
            $("#bad-review").val('');

            //사진 초기화
            $("#food_preview").attr("src", "").css("display", "none");
            $("#OCR_preview").attr("src", "").css("display", "none");

            // 파일 input 값 초기화
            $("#food_file").val('');
            $("#OCR_file").val('');

            // 이미지 변수 초기화
            foodImage = null;
            receiptImage = null;
        },
    });
}

// 클릭 이벤트 핸들러 초기 설정
$("#review-enroll").on('click', clickHandler);

//음식 사진
function foodURL(input) {
    if (input.files && input.files[0]) {
        foodImage = input.files[0];
        let reader = new FileReader();
        reader.onload = async function (e) {
            document.getElementById('food_preview').src = e.target.result;
            $("#food_preview").css("display", "inline");
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('food_preview').src = "";
        $("#food_preview").css("display", "none");
    }
}

//영수증
function readURL(input) {
    if (input.files && input.files[0]) {
        receiptImage = input.files[0];
        let reader = new FileReader();
        reader.onload = async function (e) {
            document.getElementById('OCR_preview').src = e.target.result;
            $("#OCR_preview").css("display", "inline");

            const base64Data = e.target.result.split(',')[1];
            activateSpinner();
            await requestWithBase64(base64Data);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('OCR_preview').src = "";
    }
}

imageInput.addEventListener('change', () => {
    readURL(imageInput);
});

function activateSpinner() {
    document.getElementById('spinner').style.display = 'inline-block';
    ocrButton.setAttribute('disabled', 'true');
}

function deactivateSpinner() {
    document.getElementById('spinner').style.display = 'none';
    ocrButton.removeAttribute('disabled');
}

function handleSuccess(jsonResponse) {
    if (jsonResponse != null) {
        if (jsonResponse.status === "success") {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '영수증 인증이 완료되었습니다.',
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                ocrButton.innerText = "인증완료";
                deactivateSpinner();
            });
        } else {
            Swal.fire({
                icon: "error",
                html: "불편을 드려 죄송합니다.</br>" + "다시 시도해주세요.",
                timer: 3000,
                confirmButtonColor: "#d63384",
            }).then(() => {
                ocrButton.innerText = "인증실패";
                deactivateSpinner();
            });
        }
    } else {
        deactivateSpinner();
    }
}

async function requestWithBase64(base64Data) {
    const url = "https://115.85.182.117/api/receipt/";
    const data = {
        image: base64Data,
        productId: productId,
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
        handleSuccess(jsonResponse);
    } catch (error) {
        console.log('Receipt authentication failed :', error);
        handleSuccess();
    }
}