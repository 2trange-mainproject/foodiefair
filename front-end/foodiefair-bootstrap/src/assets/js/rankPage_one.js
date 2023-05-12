document.addEventListener("DOMContentLoaded", function () {
    loadRankPageOne();
});

// 이벤트를 처리하는 함수를 분리하여 다른 탭에서 이벤트를 추가할 수 있도록 합니다.
function loadRankPageOne() {
    $(".form-select").on("change", function() {
        loadUsers(1, $(this).val());
    });

    function loadUsers(page, topRank) {
        var queryString = ``;

        if (topRank) {
            queryString += `?topRank=${topRank}`;
        }

        $.ajax({
            url: `http://localhost:8081/api/reviewer-rank${queryString}`,
            type: "GET",
            dataType: "json",
            success: function (response) {
                var data = response.dtoList;

                renderUsers(data);
            },
            error: function (error) {
                console.log(error);
            },
        });
    }

    function renderUsers(data) {
        var $productContainer = $('#productContainer');
        $productContainer.empty();
        var productHtml = '';

        $.each(data, function(index, user) {
            console.log('selectedBadge', user.selectedBadge);
            var myTag = JSON.parse(user.userTag).tag1;

            var rankElement;

            if (user.user_rank == 1) {
                rankElement = `<img src="../assets/images/profile/one.jpg" class="mb-3 img-fluid d-inline" style="max-width: 150px;">`;
            } else if (user.user_rank == 2) {
                rankElement = `<img src="../assets/images/profile/two.jpg" class="mb-3 img-fluid d-inline" style="max-width: 150px;">`;
            } else if (user.user_rank == 3) {
                rankElement = `<img src="../assets/images/profile/three.jpg" class="mb-3 img-fluid d-inline" style="max-width: 150px;">`;
            } else if (user.user_rank < 10) {
                rankElement = `<div style="display:inline-block; font-size:48px; font-family: 'Single Day', cursive; color: #181818; padding-top:30px;padding-left:50px;margin-bottom:0; padding-right: 35px; white-space: nowrap;">${user.user_rank}위</div>`;
            } else {
                rankElement = `<div style="display:inline-block; font-size:48px; font-family: 'Single Day', cursive; color: #181818; padding-top:30px;padding-left:50px;margin-bottom:0; padding-right: 20px; white-space: nowrap;">${user.user_rank}위</div>`;
            }

            productHtml += `
            <div class="col">
                <!-- card -->
                <div class="card card-product" style="padding-top: 11px;">
                    <!-- card body -->
                    <div class="card-body">
                       <div class=" row align-items-center">
                          <!-- col -->
                          <div class="col-md-4 col-12">

                             <div class="text-center position-relative">
                                <a href="mypage?userId=${user.userId}" class="d-flex">
                                   <!-- img -->
                                   <div class="flex-grow-1 img-container">
                                      ${rankElement}
                                   </div>
                                   <div class="flex-grow-1 img-container">
                                      <img class="mb-3 user-img" style="max-width: 150px;" src="${user.userImg}">
                                   </div>
                                 </a>
                             </div>
                          </div>
                          <div class="col-md-8 col-12 flex-grow-1">
                             <!-- heading -->
                             <h2 class="fs-2"><a href="mypage?userId=${user.userId}" class="text-inherit text-decoration-none">${user.userName}</a></h2>
                             <div>

                                 <!-- 칭호 -->
                                 <small class="text-warning star-icon"> <i class="bi bi-star-fill"></i></small>
                                 <span class="text-muted small tag-text">${user.selectedBadge}</span>
                             </div>
                             <div class="mt-6">
                                <!-- btn -->
                                <div class="mt-2">
                                    <a href="#!" class="btn btn-pink follow-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-plus follow-icon" viewBox="0 0 16 16">
                                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                                        </svg>
                                        <span class="follow-text">팔로우</span>
                                    </a>
                                </div>
                            </div>
                          </div>
                       </div>

                    </div>
                </div>
            </div>
          `;
        });

        var productListHtml = `
      <div class="row g-4 row-cols-1 mt-2">
        ${productHtml}
      </div>
    `;

        $productContainer.append(productListHtml);
    }

    $(document).ready(function () {
        loadUsers(1);
    });
}