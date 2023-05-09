let script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
document.head.appendChild(script);

const loginUser = JSON.parse(localStorage.getItem('loginUser'));
const userEmail = loginUser.userEmail;

function confirmDelete() {
    Swal.fire({
        title: '정말 탈퇴하시겠습니까?',
        html:
            "한 번 회원을 탈퇴하시면 같은 이메일로는</br>" +
            "회원가입이 불가능합니다.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d43384',
        cancelButtonColor: '#c8ccd4',
        confirmButtonText: '회원 탈퇴',
        cancelButtonText: '탈퇴 취소'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `http://localhost:8081/user-delete/${userEmail}`,
                type: "PUT",
                success: function (response) {
                    Swal.fire({
                            title: '회원 탈퇴',
                            text: '더 이상 해당 이메일로는 회원가입이 불가능합니다.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                            confirmButtonColor: "#d63384"
                        }
                    ).then(() => {
                        localStorage.removeItem('loginUser');
                        location.reload();
                    });
                },
                error: function (error) {
                    console.log(error);
                },
            });
        }
    })
}