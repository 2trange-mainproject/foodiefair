function getProductIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("productId");
}

$("#review-reset").on("click", function(e) {
    e.preventDefault(); // 기본 이벤트 실행 막기

    // 리뷰 정보 초기화
    $("#good-review").val('');
    $("#bad-review").val('');
    
    //Dropzone 초기화
    Dropzone.forElement("#receiptImg").removeAllFiles(true);
    Dropzone.forElement("#foodImg").removeAllFiles(true);
});

$("#review-enroll").on('click', function(e) {
    e.preventDefault(); // 기본 이벤트 실행 막기

    var userId = 35;
    // 입력된 정보 가져오기
    var productId = getProductIdFromUrl();
    var goodReviews = $("#good-review").val();
    var badReviews = $("#bad-review").val();
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
            //window.location.href = 'shop-single.html?productId=' + productId;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        },
    });
});