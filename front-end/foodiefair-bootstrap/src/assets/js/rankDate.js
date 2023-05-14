const now = new Date();
const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const thisMonthStartFormatted = `${thisMonthStart.getFullYear()}-${String(thisMonthStart.getMonth() + 1).padStart(2, '0')}-${String(thisMonthStart.getDate()).padStart(2, '0')}`;
const thisMonthEndFormatted = `${thisMonthEnd.getFullYear()}-${String(thisMonthEnd.getMonth() + 1).padStart(2, '0')}-${String(thisMonthEnd.getDate()).padStart(2, '0')}`;

document.getElementById('dateRange').innerHTML = `<i class="bi bi-info-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="* 리뷰어 랭킹은 영수증 인증이 된 리뷰의 좋아요 수와&#13;&#10;영수증 인증이 된 리뷰의 개수로 매겨집니다."></i> 집계 기간 : <span class="text-dark">${thisMonthStartFormatted} ~ ${thisMonthEndFormatted}</span>`;

document.addEventListener("DOMContentLoaded", function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});
