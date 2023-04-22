//문서 로딩 기다림
$(document).ready(function () {
    $("#register-cs").on("click", function (e) {
        e.preventDefault();

        const formData = {
            inquiryType: $("input[name='radioRegister']:checked").attr("id"),
            content: $(".register-content").val(),
        };


        $.ajax({
            url: "http://localhost:8081/api/cscenter/registercs",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                console.log('Success:', response);
            },
            error: function (xhr, status, error) {
                console.log("Error submitting form");
                console.error('Error:', error);
            },
        });
    });
});