getUserInfo().then(data => {
    if (data) { // 로그인 데이터가 있을 때
        loginUserId = data.userId;
    } else { // 로그인 데이터가 없을 때
        loginUserId = null;
    }
});

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
                <div class="text-center  position-relative "> <a href="../pages/mypage?userId=${user.userId}" onclick="preventClick(event)">
                    <img src="${user.userImg}" style="width: 250px; height: 250px; object-fit: cover;" alt="rank${user.user_rank}" class="mb-3 img-fluid"></a>
                </div>
                <h2 class="fs-6" style="margin-left: 15px"><a href="../pages/mypage?userId=${user.userId}" class="text-inherit text-decoration-none" onclick="preventClick(event)">${user.userName}</a></h2>

                <div class="d-flex justify-content-between align-items-center" style="margin-left: 15px">
                  <div>
                    <small class="text-warning"> <i class="bi bi-star-fill"></i></small>
                    <span><small>${user.selectedBadge}</small></span>
                  </div>
                </div>
                <div class="d-grid mt-2 justify-content-center align-items-center" >
                    <a href="#!" class="btn btn-primary" data-user-id="${user.userId}" style="width: 250px;" >
                         <i class="bi bi-person-plus" style="width=16px; height=16px;"></i> 
                         <span class="follow-text">팔로우</span></a></div>
                <div class="d-flex justify-content-start text-center mt-3">
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

            data.forEach(user => {
                let followButton = $(`[data-user-id="${user.userId}"]`);

                if (loginUserId) { // 로그인한 경우
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
    console.log("loginUserId :", loginUserId);


    if (isFollowed) {
        followIcon.removeClass('bi-person-plus').addClass('bi-person-dash');
        followText.text('언팔로우');
        button.removeClass('btn-primary').addClass('btn-light');

        button.off('click');
        button.on('click', function() {
            unfollowUser(button.data('user-id'), loginUserId, button.data('user-id'));
        });
    } else {
        followIcon.removeClass('bi-person-dash').addClass('bi-person-plus');
        followText.text('팔로우');
        button.removeClass('btn-light').addClass('btn-primary');

        button.off('click');
        button.on('click', function() {
            followUser(button.data('user-id'), loginUserId, button.data('user-id'));
        });
    }
}

function preventClick(event) {
    if (!loginUserId) {
        event.preventDefault();
        Swal.fire({
            title: "마이페이지 이동 실패",
            html: `로그인이 필요한 기능입니다.<br> 로그인 후 다시 시도해주세요.`,
            icon: "warning",
            showConfirmButton: false,
            timer: 1200,
        });
    }
}
