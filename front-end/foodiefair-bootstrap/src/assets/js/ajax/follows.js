$(document).ready(async function () {
    try {
        const followerCount = await fetchFollowCount(userId, 'followers');
        $('#follower-count').text(followerCount);
        $('#followers-tab').text(`팔로워 ${followerCount}명`);

        const followingCount = await fetchFollowCount(userId, 'followings');
        $('#following-count').text(followingCount);
        $('#followings-tab').text(`팔로잉 ${followingCount}명`);

        // Set the initial active tab from localStorage
        const initialActiveTabId = localStorage.getItem('activeTab');
        if (initialActiveTabId) {
            switchActiveTab(initialActiveTabId);
            localStorage.removeItem('activeTab');
        } else {
            await loadMoreFollowData('#followers-tab-pane .row-cols-1', userId, 'followers');
        }
    } catch (error) {
        console.error('Error initializing the page:', error);
    }

    // Add event listeners for tab buttons
    document.getElementById('followers-tab').addEventListener('click', function() {
        switchActiveTab('followers-tab');
    });

    document.getElementById('followings-tab').addEventListener('click', function() {
        switchActiveTab('followings-tab');
    });

    $(window).on('scroll', debounce(async function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            if ($('#followers-tab').hasClass('active')) {
                await loadMoreFollowData('#followers-tab-pane .row-cols-1', userId, 'followers');
            } else if ($('#followings-tab').hasClass('active')) {
                await loadMoreFollowData('#followings-tab-pane .row-cols-1', userId, 'followings');
            }
        }
    }, 250));

    // getActiveTab();
});

async function fetchFollowData(userId, type, lastFollowId, perPage, loginUserId) {
    try {
        const response = await $.ajax({
            url: `https://115.85.183.196/mypage/${userId}/${type}`,
            method: 'GET',
            dataType: 'json',
            data: {
                lastFollowId: lastFollowId,
                perPage: perPage,
                loginUserId: loginUserId
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
            url: `https://115.85.183.196/mypage/${userId}/${type}/count`,
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
function createProfileCard(user, selectedBadge) {

    return `
    <div class="col" data-follow-id="${user.followId}">
        <div class="card card-followers">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-4 col-12">
                        <div class="text-center position-relative">
                            <a href="#" class="d-flex user-profile-link" onclick="goToUserProfile(${user.userId})">
                                <div class="flex-grow-1">
                                    <img src="${user.userImg}" alt="Profile Image" class="mb-3 img-fluid d-inline" width="150" height="150">
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="col-md-8 col-12 flex-grow-1">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h2 class="fs-2"><a href="#" class="d-flex user-profile-link" onclick="goToUserProfile(${user.userId})" class="text-inherit text-decoration-none">${user.userName}</a></h2>
                                <div>
                                    <small class="text-warning"> <i class="bi bi-star-fill"></i></small>
                                   <span class="text-muted small tag-text">${selectedBadge}</span>
                                </div>
                            </div>
                            <div class="mt-2">
 <button class="btn follow-btn ${user.isFollowed ? 'btn-light' : 'btn-pink'}" data-user-id="${user.userId}" style="width: ${user.isFollowed ? '120px' : '120px'};" onclick="${user.isFollowed ? 'unfollowUser(' + user.userId + ',' + loginUserId + ',' + user.userId + ')' : 'followUser(' + user.userId + ',' + loginUserId + ',' + user.userId + ')'}">
                                    <i class="bi ${user.isFollowed ? 'bi-person-dash' : 'bi-person-plus'}" style="margin-right: 6px;"></i>
                                    <span class="follow-text">${user.isFollowed ? '언팔로우' : '팔로우'}</span>
                                </button>                                </div>
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
        console.log("userId : ", userId);
        console.log("type : ", type);
        console.log("lastFollowId : ", lastFollowId);
        console.log("loginUserId : ", loginUserId);
        const data = await fetchFollowData(userId, type, lastFollowId, 10, loginUserId);
        console.log("Fetched data:", data);

        const html = await Promise.all(
            data.map(async user => {
                let selectedBadge = await fetchUserBadges(user.userId);
                console.log('selectedBadge : ', selectedBadge);
                return createProfileCard(user, selectedBadge);
            })
        ).then(cards => cards.join(''));
        $(containerSelector).append(html);

        if (data.length < 10) {
            $(window).off('scroll');
        }
    } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
    }
}

async function followUser(userId, loginUserId, followedId) {
    const followDTO = {
        followingId: loginUserId,
        followedId: followedId,
    };

    const response = await fetch(`https://115.85.183.196/mypage/${userId}/follow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(followDTO),
    });

    if (response.ok) {
        console.log('Follow success');
        let followButton = document.querySelector(`[data-user-id="${userId}"]`);
        followButton.innerHTML = "";
        followButton.classList.remove("btn-pink");
        followButton.classList.add("btn-light");
        followButton.style.width = "120px";
        followButton.setAttribute("onclick", `unfollowUser(${userId}, ${loginUserId}, ${followedId})`);

        let unfollowIcon = document.createElement('i');
        unfollowIcon.classList.add("bi", "bi-person-dash");
        unfollowIcon.style.marginRight = "6px";
        let unfollowText = document.createElement('span');
        unfollowText.setAttribute('class', 'follow-text');
        unfollowText.innerText = "언팔로우";

        followButton.appendChild(unfollowIcon);
        followButton.appendChild(unfollowText);
    } else {
        console.error('Failed to follow user');
    }
}

async function unfollowUser(userId, loginUserId, followedId) {
    const response = await fetch(`https://115.85.183.196/mypage/${userId}/unfollow?loginUserId=${loginUserId}&followedId=${followedId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        console.log('Unfollow success');
        let followButton = document.querySelector(`[data-user-id="${userId}"]`);
        followButton.innerHTML = "";
        followButton.classList.remove("btn-light");
        followButton.classList.add("btn-pink");
        followButton.style.width = "120px";
        followButton.setAttribute("onclick", `followUser(${userId}, ${loginUserId}, ${followedId})`);

        let followIcon = document.createElement('i');
        followIcon.classList.add("bi", "bi-person-plus");
        followIcon.style.marginRight = "6px";
        let followText = document.createElement('span');
        followText.setAttribute('class', 'follow-text');
        followText.innerText = "팔로우";

        followButton.appendChild(followIcon);
        followButton.appendChild(followText);
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

function switchActiveTab(newActiveTabId) {
    // Deactivate the current active tab and clear its data
    const currentActiveTabId = $('.nav-link.active').attr('id');
    if (currentActiveTabId) {
        $(`#${currentActiveTabId}`).removeClass('active');
        $(`#${currentActiveTabId}-pane`).removeClass('show active');
        $(`#${currentActiveTabId}-pane .row-cols-1`).empty();
    }

    // Activate the new active tab
    $(`#${newActiveTabId}`).addClass('active');
    $(`#${newActiveTabId}-pane`).addClass('show active');

    // Load data for the new active tab
    loadMoreFollowData(`#${newActiveTabId}-pane .row-cols-1`, userId, newActiveTabId.slice(0, -4));
}

function goToUserProfile(userId) {
    window.opener.location.href = `mypage?userId=${userId}`;
    window.close();
}


async function fetchUserBadges(userId) {
    try {
        const response = await fetch(`https://115.85.183.196/mypage/${userId}/userSelectedBadge`);
        const selectedBadge = await response.text(); // Get the JSON object directly
        return selectedBadge;
    } catch (error) {
        console.error('Error fetching user badges:', error);
        return "";
    }
}
