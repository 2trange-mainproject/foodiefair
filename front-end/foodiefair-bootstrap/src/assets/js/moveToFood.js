document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    redirectToShopFilterPage();
});

document.getElementById('search-button').addEventListener('click', function () {
    redirectToShopFilterPage();
});

function redirectToShopFilterPage() {
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput.value;

    // 현재 페이지의 URL을 가져옵니다.
    const currentUrl = window.location.href;

    // 현재 URL에서 마지막 슬래시('/')의 위치를 찾습니다.
    const lastSlashIndex = currentUrl.lastIndexOf('/');

    // 현재 URL에서 마지막 슬래시 이후의 부분을 제거합니다.
    const baseUrl = currentUrl.substring(0, lastSlashIndex + 1);

    // 적절한 상대 경로를 생성합니다.
    const targetUrl = baseUrl + (baseUrl.endsWith('pages/') ? '' : 'pages/') + 'shop-filter.html';

    // LocalStorage를 사용하여 키워드 값을 저장합니다.
    localStorage.setItem('searchKeyword', keyword);

    // 지정된 URL로 이동합니다.
    window.location.href = targetUrl;
}