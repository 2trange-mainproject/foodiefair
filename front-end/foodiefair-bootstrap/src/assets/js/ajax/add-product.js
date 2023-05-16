$(document).ready(function() {
    $("#add-product").click(function() {
        // 입력된 정보 가져오기
        var productId = $("#product-id").val();
        var productName = $("#product-name").val();
        var productPrice = $("#product-price").val();
        var productFestival = $("#product-festival").val();
        var productTag = $("#product-tag").val();
        var formData = new FormData();    //FormData를 사용하면 파일을 포함한 데이터를 전송할 수 있다고 함.
        formData.append("productId", productId);
        formData.append("productName", productName);
        formData.append("productPrice", productPrice);
        formData.append("productFestival", productFestival);
        formData.append("productTag", productTag);
        formData.append("productImg", $("#product-img")[0].files[0]);

        // Ajax를 이용해 서버로 정보 전송
        $.ajax({
            type: "POST",
            url: "http://localhost:8081/api/add-product",
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
            },
            error: function(jqXHR, textStatus, errorThrown) {
            }
        });
    });
});
