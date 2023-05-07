let userId = 1;
let loggedUserId = 1;

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

    getActiveTab();
});

async function fetchFollowData(userId, type, lastFollowId, perPage, loggedUserId) {
    try {
        const response = await $.ajax({
            url: `http://localhost:8081/mypage/${userId}/${type}`,
            method: 'GET',
            dataType: 'json',
            data: {
                lastFollowId: lastFollowId,
                perPage: perPage,
                loggedUserId: loggedUserId
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
                                <button class="btn ${user.isFollowed ? 'btn-light' : 'btn-pink'}" onclick="${user.isFollowed ? 'unfollowUser(' + user.userId + ',' + loggedUserId + ',' + user.userId + ')' : 'followUser(' + user.userId + ',' + loggedUserId + ',' + user.userId + ')'}">${user.isFollowed ? '언팔로우' : '팔로우'}</button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

async function loadMoreFollowData(containerSelector, userId, type) {
    let lastItem = $(containerSelector).children().last();
    let lastFollowId = lastItem.length ? lastItem.data('follow-id') : null;

    try {
        const data = await fetchFollowData(userId, type, lastFollowId, 10, loggedUserId);
        console.log("Fetched data:", data);
        const html = data.map(createProfileCard).join('');
        $(containerSelector).append(html);

        if (data.length < 10) {
            $(window).off('scroll');
        }
    } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
    }
}

async function followUser(userId, loggedUserId, followedId) {
    const followDTO = {
        followingId: loggedUserId,
        followedId: followedId,
    };

    const response = await fetch(`http://localhost:8081/mypage/${userId}/follow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(followDTO),
    });

    if (response.ok) {
        console.log('Follow success');
    } else {
        console.error('Failed to follow user');
    }
}

async function unfollowUser(userId, loggedUserId, followedId) {
    const response = await fetch(`http://localhost:8081/mypage/${userId}/unfollow?loggedUserId=${loggedUserId}&followedId=${followedId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        console.log('Unfollow success');
    } else {
        console.error('Failed to unfollow user');
    }
}


function debounce(func, wait) {
    let timeout;
    let inProgress = false;
    return function () {
        if (inProgress) return; // Prevent further requests if the previous request is still in progress
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            inProgress = false; // Set inProgress to false after the request has been completed
            func.apply(context, args);
        };
        clearTimeout(timeout);
        inProgress = true; // Set inProgress to true before starting the request
        timeout = setTimeout(later, wait);
    };
}

function getActiveTab() {
    const activeTabId = localStorage.getItem('activeTab');
    if (activeTabId) {
        // Remove the 'active' class from all tabs
        $('.nav-link').removeClass('active');
        $('.tab-pane').removeClass('show active');

        // Add the 'active' class to the selected tab and its pane
        $(`#${activeTabId}`).addClass('active');
        $(`#${activeTabId}-pane`).addClass('show active');
        localStorage.removeItem('activeTab');
    }
}


