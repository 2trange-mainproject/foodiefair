function renderUsers(data) {
    let $rankingContainer = $('#rankingContainer');
    $rankingContainer.addClass("d-flex gap-4");

    $.each(data, function (index, user) {
        //유저 랭킹은 3등까지만 보여짐.
        if (user.user_rank === 1 || user.user_rank === 2 || user.user_rank === 3) {
            let myTag = JSON.parse(user.userTag).tag1;

            let indexRankHtml = `
           <div class="col">
            <div class="card card-product" style="min-width: 310px">
              <div class="card-body">
                <div class="text-center  position-relative "> <a href="./pages/mypage">
                <img src="${user.userImg}" style="max-width: 220px" alt="rank${user.user_rank}" class="mb-3 img-fluid"></a>
                </div>
                <div class="text-small mb-1"><a href="#!" class="text-decoration-none text-muted"><small>리뷰어 ${user.user_rank}위</small></a></div>
                <h2 class="fs-6"><a href="./pages/mypage" class="text-inherit text-decoration-none">${user.userName}</a></h2>

                <div class="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <small class="text-warning"> <i class="bi bi-star-fill"></i></small>
                    <span><small>${user.selectedBadge}</small></span>
                  </div>
                </div>
                <div class="d-grid mt-2"><a href="#!" class="btn btn-primary ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus" viewBox="0 0 16 16">
                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                    <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                  </svg> 팔로우 </a></div>
                <div class="d-flex justify-content-start text-center mt-3">
                  <div class="deals-countdown w-100" data-countdown="2028/11/11 00:00:00"></div>
                </div>
              </div>
            </div>
          </div>
            `;

            let indexRankingListHtml = `
            ${indexRankHtml}
    `;
            $rankingContainer.append(indexRankingListHtml);

            // 타이머 관련 코드 추가
            $("[data-countdown]").each(function () {
                var $this = $(this),
                    finalDate = $(this).data("countdown");
                $this.countdown(finalDate, function (event) {
                    $(this).html(event.strftime("" + '<span class="countdown-section"><span class="countdown-amount hover-up">%D</span><span class="countdown-period"> days </span></span>' + '<span class="countdown-section"><span class="countdown-amount hover-up">%H</span><span class="countdown-period"> hours </span></span>' + '<span class="countdown-section"><span class="countdown-amount hover-up">%M</span><span class="countdown-period"> mins </span></span>' + '<span class="countdown-section"><span class="countdown-amount hover-up">%S</span><span class="countdown-period"> sec </span></span>'));
                });
            });

        }
    });
}

$(document).ready(function () {
    $.ajax({
        url: `http://localhost:8081/api/reviewer-rank`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response.dtoList;
            console.log(data) //불러오는 건 1페이지의 10명의 유저를 다 불러옴

            renderUsers(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
});