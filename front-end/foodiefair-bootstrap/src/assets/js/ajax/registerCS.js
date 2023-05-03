var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
document.head.appendChild(script);

$(document).ready(function () {
    $("#csSubmit").on("click", function (e) {
        e.preventDefault();

        let userId = 35;

        const formData = {
            userId: 35,
            questionType: $("input[name='radioRegister']:checked").attr("id"),
            questionDate: new Date(),
            questionContent: $(".register-content").val(),
        };

        $.ajax({
            url: "http://localhost:8081/api/cscenter/registercs",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                console.log("Success:", response);
                if (response === "ok") {
                    Swal.fire({
                        icon: 'success',
                        html:
                            "답변은 이메일로 전달해드립니다.</br>" +
                            "처리까지 시간이 걸릴 수 있습니다. 감사합니다.",
                        timer: 3000,
                        confirmButtonColor: "#d63384",
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        html:
                            "불편을 드려 죄송합니다.</br>" +
                            "잠시 후에 다시 시도해주세요.",
                        timer: 3000,
                        confirmButtonColor: "#d63384",
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            },
        });
    });
});
