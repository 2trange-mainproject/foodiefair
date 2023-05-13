getUserInfo().then(data => {
    if (data) { // 로그인 데이터가 있을 때
        loginUserId = data.userId;
    } else { // 로그인 데이터가 없을 때
        loginUserId = null;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    loadRankPageOne();
});

// 이벤트를 처리하는 함수를 분리하여 다른 탭에서 이벤트를 추가할 수 있도록 합니다.
function loadRankPageOne() {
    $(".form-select").on("change", function () {
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

        $.each(data, function (index, user) {
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
                                    <a href="#!" class="btn btn-pink follow-btn" style="width: 120px;" data-user-id="${user.userId}">
                                        <i class="bi bi-person-plus" style="width=24px; height=24px;"></i>
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

        data.forEach(user => {
            let followButton = $(`[data-user-id="${user.userId}"]`);
            if(loginUserId) { // 로그인한 경우
                fetchFollowStatus(loginUserId, user.userId).then(isFollowing => {
                    updateFollowButton(followButton, isFollowing);
                });
            } else { // 로그인하지 않은 경우
                followButton.on('click', function(e) {
                    e.preventDefault();
                    Swal.fire({
                        title: "팔로우 실패",
                        html: `로그인이 필요한 기능입니다.<br> 로그인 후 다시 시도해주세요.`,
                        icon: "warning",
                        showConfirmButton: false,
                        timer: 1200,
                    });
                    return;
                });
            }


        });
    }


    $(document).ready(function () {
        loadUsers(1);
    });
}

function followUser(userId, loginUserId, followedId) {
    const followDTO = {
        followingId: loginUserId,
        followedId: followedId,
    };

    let followButton = $(`[data-user-id="${userId}"]`);

    $.ajax({
        url: `http://localhost:8081/mypage/${userId}/follow`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(followDTO),
        success: function() {
            console.log('Follow success');
            updateFollowButton(followButton, true);
        },
        error: function() {
            console.error('Failed to follow user');
        }
    });
}

function unfollowUser(userId, loginUserId, followedId) {
    let followButton = $(`[data-user-id="${userId}"]`);

    $.ajax({
        url: `http://localhost:8081/mypage/${userId}/unfollow?loginUserId=${loginUserId}&followedId=${followedId}`,
        type: "DELETE",
        success: function() {
            console.log('Unfollow success');
            updateFollowButton(followButton, false);
        },
        error: function() {
            console.error('Failed to unfollow user');
        }
    });
}


function fetchFollowStatus(loginUserId, userId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `http://localhost:8081/mypage/${userId}/following-check?loginUserId=${loginUserId}`,
            type: "GET",
            success: function(response) {
                resolve(response);
            },
            error: function() {
                reject('Failed to fetch follow status');
            }
        });
    });
}

function updateFollowButton(button, isFollowed) {
    var followIcon = button.find('.bi');
    var followText = button.find('.follow-text');

    if (isFollowed) {
        followIcon.removeClass('bi-person-plus').addClass('bi-person-dash');
        followText.text('언팔로우');
        button.removeClass('btn-pink').addClass('btn-light');

        button.off('click');
        button.on('click', function() {
            unfollowUser(button.data('user-id'), loginUserId, button.data('user-id'));
        });
    } else {
        followIcon.removeClass('bi-person-dash').addClass('bi-person-plus');
        followText.text('팔로우');
        button.removeClass('btn-light').addClass('btn-pink');

        button.off('click');
        button.on('click', function() {
            followUser(button.data('user-id'), loginUserId, button.data('user-id'));
        });
    }
}
