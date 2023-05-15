$(document).ready(function () {
    $("#csSubmit").on("click", async function (e) {
        e.preventDefault();

        const loginUser = await getUserInfo();
        if(!loginUser){
            Swal.fire({
                title: "문의 실패",
                html: `로그인이 필요한 기능입니다.<br> 로그인 후 다시 시도해주세요.`,
                icon: "warning",
                showConfirmButton: false,
                timer: 1200,
            });
            return;
        }

        var userId = loginUser.userId;

        const formData = {
            userId: userId,
            questionType: $("input[name='radioRegister']:checked").attr("id"),
            questionDate: new Date(),
            questionContent: $(".register-content").val(),
        };

        $.ajax({
            url: "https://115.85.183.196/api/cscenter/registercs",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                console.log("Success:", response);
                if (response === "ok") {
                    $(".register-content").val('');
                    Swal.fire({
                        icon: "success",
                        html:
                            "답변은 이메일로 전달해드립니다.</br>" +
                            "처리까지 시간이 걸릴 수 있습니다. 감사합니다.",
                        timer: 3000,
                        confirmButtonColor: "#d63384",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
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