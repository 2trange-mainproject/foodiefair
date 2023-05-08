document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    redirectToShopFilterPage();
});

function redirectToShopFilterPage() {
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput.value;

    // 현재 페이지의 URL을 가져옵니다.
    const currentUrl = window.location.href;

    // LocalStorage를 사용하여 키워드 값을 저장합니다.
    localStorage.setItem('searchKeyword', keyword);

    // 지정된 URL로 이동합니다.
    window.location.href = currentUrl;
}