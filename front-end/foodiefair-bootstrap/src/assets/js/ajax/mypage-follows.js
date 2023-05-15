
$(document).ready(async function () {

    try {
        const followerCount = await fetchFollowCount(userId, 'followers');
        $('#follower-count').text(followerCount);
        $('#followers-tab').text(`팔로워 ${followerCount}명`);

        const followingCount = await fetchFollowCount(userId, 'followings');
        $('#following-count').text(followingCount);
        $('#followings-tab').text(`팔로잉 ${followingCount}명`);

        const isFollowing = await fetchFollowStatus(loginUserId, userId);
        updateFollowButton(isFollowing, userId, loginUserId);

    } catch (error) {
        console.error('Error initializing the page:', error);
    }


    // 탭 버튼 클릭 이벤트 리스너 등록
    document.getElementById('followers-tab').addEventListener('click', function() {
        setActiveTab('followers-tab');
    });

    document.getElementById('followings-tab').addEventListener('click', function() {
        setActiveTab('followings-tab');
    });
});


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

// localStorage에 active한 탭 Id를 담아 전달, 3초후 삭제
function setActiveTab(activeTabId) {
    localStorage.setItem('activeTab', activeTabId);
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
        let followButton = document.getElementById("userFollow");
        followButton.innerText = "";
        followButton.classList.remove("btn-pink");
        followButton.classList.add("btn-light");
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
        let followButton = document.getElementById("userFollow");
        followButton.innerText = "";
        followButton.classList.remove("btn-light");
        followButton.classList.add("btn-pink");
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

    async function fetchFollowStatus(loginUserId, userId) {
        try {
            const response = await $.ajax({
                url: `https://115.85.183.196/mypage/${userId}/following-check?loginUserId=${loginUserId}`,
                method: 'GET',
                dataType: 'json',
            });
            return response;
        } catch (error) {
            console.error('Error fetching follow status:', error);
        }
    }


function updateFollowButton(isFollowing, loginUserId, userId) {
    if (parseInt(userId) === parseInt(loginUserId)) {
        return;
    }

    let followButton = document.createElement('a');
    followButton.setAttribute('id', 'userFollow');
    followButton.setAttribute('class', 'btn follow-btn');
    followButton.setAttribute('href', '#!');

    let followIcon = document.createElement('i');
    followIcon.setAttribute('class', 'bi');
    let followText = document.createElement('span');
    followText.setAttribute('class', 'follow-text');

    if (isFollowing) {
        followButton.classList.add("btn-light");
        followButton.style.width = "200px";
        followIcon.classList.add("bi-person-dash");
        followIcon.style.marginRight = "6px";
        followText.innerText = "언팔로우";
        followButton.setAttribute("onclick", `unfollowUser(${loginUserId}, ${userId}, ${loginUserId})`);
    } else {
        followButton.classList.add("btn-pink");
        followButton.style.width = "200px";
        followIcon.classList.add("bi-person-plus");
        followIcon.style.marginRight = "6px";
        followText.innerText = "팔로우";
        followButton.setAttribute("onclick", `followUser(${loginUserId}, ${userId}, ${loginUserId})`);
    }

    followButton.appendChild(followIcon);
    followButton.appendChild(followText);

    let container = document.getElementById('userFollowDiv');
    container.innerHTML = '';  // Clear previous button
    container.appendChild(followButton);
}
