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

$(document).ready(function() {
    $("#add-product").on('click', function(e) {
        // 입력된 정보 가져오기
        var productId = $("#product-id").val();
        var productName = $("#product-name").val();
        var productPrice = $("#product-price").val();
        var productFestival = $("#product-festival").val();
        var productTag = $("#product-tag").val();
        var jsonProductTag = tagsToJson(productTag);
        var productImg = $("#product-img")[0].files[0];

        // FormData 객체 생성
        var formData = new FormData();
        formData.append("productId", productId);
        formData.append("productName", productName);
        formData.append("productPrice", productPrice);
        formData.append("productFestival", productFestival);
        formData.append("productTag", jsonProductTag);
        formData.append("productImg", productImg); // 이미지 파일 추가

        // Ajax를 이용해 서버로 정보 전송
        $.ajax({
            type: "POST",
            url: "https://115.85.183.196:8081/dashboard/product-add",
            processData: false, // 필수: FormData 사용 시 false로 설정
            contentType: false, // 필수: FormData 사용 시 false로 설정
            data: formData,
            xhrFields: {
                withCredentials: true // 쿠키를 전송하려면 이 옵션을 설정해야 합니다.
            },
            success: function(response) {
                console.log(response);
                window.location.href = 'products';
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            },
        });
    });
});