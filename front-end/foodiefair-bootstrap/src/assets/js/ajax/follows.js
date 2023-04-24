// 초기 페이지 로드 시 팔로워와 팔로잉 데이터를 가져오고, 무한 스크롤을 적용합니다.
$(document).ready(function () {
    const userId = 1; // 이 부분은 실제로는 로그인한 사용자의 ID를 받아와야 합니다.

    // 팔로워 수를 가져와서 화면에 표시
    fetchFollowCount(userId, 'followers')
        .then(function(count) {
            $('#follower-count').text(count);
            $('#followers-tab').text(`팔로워 ${count}명`);
        });

    // 팔로잉 수를 가져와서 화면에 표시
    fetchFollowCount(userId, 'followings')
        .then(function(count) {
            $('#following-count').text(count);
            $('#followings-tab').text(`팔로잉 ${count}명`);
        });

    // 팔로워 데이터를 가져와서 무한 스크롤 적용
    fetchFollowData(userId, 'followers', 1, 10)
        .then(function (data) {
            displayFollowDataWithInfiniteScroll('#followers-tab-pane .row-cols-1', data);
        })
        .catch(function (error) {
            console.error('Error fetching followers data:', error);
        });

    // 팔로잉 데이터를 가져와서 무한 스크롤 적용
    fetchFollowData(userId, 'followings', 1, 10)
        .then(function (data) {
            displayFollowDataWithInfiniteScroll('#followings-tab-pane .row-cols-1', data);
        })
        .catch(function (error) {
            console.error('Error fetching followings data:', error);
        });
});

function fetchFollowData(userId, type, page, perPage) {
    return $.ajax({
        url: `http://localhost:8081/mypage/${userId}/${type}`,
        method: 'GET',
        dataType: 'json',
        data: {
            page: page,
            perPage: perPage,
        },
    });
}

function fetchFollowCount(userId, type) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: `http://localhost:8081/mypage/${userId}/${type}/count`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                let count = data;
                $(`#${type}-tab`).text(`${type === 'followers' ? '팔로워' : '팔로잉'} ${count}명`);
                resolve(count);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
}

// 팔로워와 팔로잉 프로필 카드를 생성하는 함수
function createProfileCard(user) {
    return `
    <div class="col">
        <div class="card card-followers">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-4 col-12">
                        <div class="text-center position-relative">
                            <a href="shop-single.html" class="d-flex">
                                <div class="flex-grow-1">
                                    <img src="${user.userImg}" alt="Profile Image" class="mb-3 img-fluid d-inline" width="150" height="150">
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="col-md-8 col-12 flex-grow-1">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h2 class="fs-2"><a href="shop-single.html" class="text-inherit text-decoration-none">${user.userName}</a></h2>
                                <div>
                                    <small class="text-warning"> <i class="bi bi-star-fill"></i></small>
                                    <span class="text-muted small">임시 칭호</span>
                                </div>
                            </div>
                            <div class="mt-2">
                                <button class="btn btn-pink">팔로우</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function displayFollowDataWithInfiniteScroll(containerSelector, initialData) {
    // 초기 데이터로 HTML을 생성하여 화면에 표시
    const html = initialData.map(createProfileCard).join('');
    $(containerSelector).html(html);

    // 무한 스크롤 적용을 위한 Infinite Scroll 설정
    const options = {
        navSelector: '.page-nav',
        nextSelector: '.page-nav a',
        itemSelector: '.row-cols-1 > div',
        dataType: 'json',
        debug: true,
        path: function (page) {
            const url = new URL(`http://localhost:8081/mypage/${userId}/${type}`);
            url.searchParams.append('page', page);
            url.searchParams.append('perPage', 10);
            return url.toString();
        },
        appendCallback: false,
    };

    $(containerSelector).infinitescroll(options, function (data) {
        // 새로운 데이터로 HTML을 생성하여 화면에 추가
        const html = data.map(createProfileCard).join('');
        $(containerSelector).append(html);
    });
}

