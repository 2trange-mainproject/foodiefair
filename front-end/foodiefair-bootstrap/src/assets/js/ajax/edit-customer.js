// 페이지 로드 시 실행
$(document).ready(function() {
    // URL에서 id 값을 가져옴
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // GET 요청을 보내기 위한 URL 생성
    const url = `/http://localhost:8081/api/edit-customer/${id}`;

    // GET 요청 보내기
    $.get(url, function(data) {
        // 응답 데이터(JSON)를 자바스크립트 객체로 파싱
        const user = JSON.parse(data);

        // 입력 폼에 데이터 출력
        $('#user-id').val(user.id);
        $('#user-email').val(user.email);
        $('#user-nickname').val(user.nickname);
        $('#user-intro').val(user.intro);
        $('#user-tags').val(user.tags);

        // 프로필 사진 출력
        $('#user-profile').attr('src', user.profile);
    });
});