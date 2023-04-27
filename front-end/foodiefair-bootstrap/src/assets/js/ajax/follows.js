const userId = 1;

$(document).ready(async function () {
    try {
        const followerCount = await fetchFollowCount(userId, 'followers');
        $('#follower-count').text(followerCount);
        $('#followers-tab').text(`팔로워 ${followerCount}명`);

        const followingCount = await fetchFollowCount(userId, 'followings');
        $('#following-count').text(followingCount);
        $('#followings-tab').text(`팔로잉 ${followingCount}명`);

        await loadMoreFollowData('#followers-tab-pane .row-cols-1', userId, 'followers');
        await loadMoreFollowData('#followings-tab-pane .row-cols-1', userId, 'followings');
    } catch (error) {
        console.error('Error initializing the page:', error);
    }

    $(window).on('scroll', debounce(async function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            if ($('#followers-tab').hasClass('active')) {
                await loadMoreFollowData('#followers-tab-pane .row-cols-1', userId, 'followers');
            } else if ($('#followings-tab').hasClass('active')) {
                await loadMoreFollowData('#followings-tab-pane .row-cols-1', userId, 'followings');
            }
        }
    }, 250));
});

// 스크롤 이벤트를 추가하여 사용자가 페이지 하단에 도달하면 추가 팔로워 데이터를 로드합니다.
$(window).on('scroll', debouncedLoadMoreFollowData);


async function fetchFollowData(userId, type, lastFollowId, perPage) {
    try {
        const response = await $.ajax({
            url: `http://localhost:8081/mypage/${userId}/${type}`,
            method: 'GET',
            dataType: 'json',
            data: {
                lastFollowId: lastFollowId,
                perPage: perPage,
            },
        });
        return response;
    } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
    }
}

async function fetchFollowCount(userId, type) {
    try {
        const response = await $.ajax({
            url: `http://localhost:8081/mypage/${userId}/${type}/count`,
            method: 'GET',
            dataType: 'json',
        });
        const count = response;
        $(`#${type}-tab`).text(`${type === 'followers' ? '팔로워' : '팔로잉'} ${count}명`);
        return count;
    } catch (error) {
        console.error(`Error fetching ${type} count:`, error);
    }
}

// 팔로워와 팔로잉 프로필 카드를 생성하는 함수
function createProfileCard(user) {
    return `
    <div class="col" data-follow-id="${user.followId}">
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

async function loadMoreFollowData(containerSelector, userId, type, loadMoreUrl) {
    let lastItem = $(containerSelector).children().last();
    let lastFollowId = lastItem.length ? lastItem.data('follow-id') : null;

    try {
        const data = await fetchFollowData(userId, type, lastFollowId, 10);
        console.log("Fetched data:", data);
        const html = data.map(createProfileCard).join('');
        $(containerSelector).append(html);

        if (data.length === 10) {
            let nextLastFollowId = data[data.length - 1].followId;
            let loadMoreUrl = `http://localhost:8081/mypage/${userId}/${type}?lastFollowId=${nextLastFollowId}`;
            $(window).off('scroll').on('scroll', async function () {
                if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
                    if ($('#followers-tab').hasClass('active')) {
                        await loadMoreFollowData('#followers-tab-pane .row-cols-1', userId, 'followers', loadMoreUrl);
                    } else if ($('#followings-tab').hasClass('active')) {
                        await loadMoreFollowData('#followings-tab-pane .row-cols-1', userId, 'followings', loadMoreUrl);
                    }
                }
            });
        }
    } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
    }
}

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
