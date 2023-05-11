getUserInfo().then(data => {
    loginUserId = data.userId;
});
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

// localStorage에 active한 탭 Id를 담아 전달, 3초후 삭제
function setActiveTab(activeTabId) {
    localStorage.setItem('activeTab', activeTabId);
}

async function followUser(userId, loginUserId, followedId) {
    const followDTO = {
        followingId: loginUserId,
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
        let followButton = document.getElementById("userFollow");
        followButton.innerText = "언팔로우";
        followButton.classList.remove("btn-pink");
        followButton.classList.add("btn-light");
        followButton.setAttribute("onclick", `unfollowUser(${userId}, ${loginUserId}, ${followedId})`);
    } else {
        console.error('Failed to follow user');
    }
}

async function unfollowUser(userId, loginUserId, followedId) {
    const response = await fetch(`http://localhost:8081/mypage/${userId}/unfollow?loginUserId=${loginUserId}&followedId=${followedId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        console.log('Unfollow success');
        let followButton = document.getElementById("userFollow");
        followButton.innerText = "팔로우";
        followButton.classList.remove("btn-light");
        followButton.classList.add("btn-pink");
        followButton.setAttribute("onclick", `followUser(${userId}, ${loginUserId}, ${followedId})`);
    } else {
        console.error('Failed to unfollow user');
    }
}

    async function fetchFollowStatus(loginUserId, userId) {
        try {
            const response = await $.ajax({
                url: `http://localhost:8081/mypage/${userId}/following-check?loginUserId=${loginUserId}`,
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

    let followButton = document.createElement('button');
    followButton.setAttribute('id', 'userFollow');
    followButton.setAttribute('class', 'followBtn btn');

    if (isFollowing) {
        followButton.innerText = "언팔로우";
        followButton.classList.add("btn-light");
        followButton.setAttribute("onclick", `unfollowUser(${loginUserId}, ${userId}, ${loginUserId})`);
    } else {
        followButton.innerText = "팔로우";
        followButton.classList.add("btn-pink");
        followButton.setAttribute("onclick", `followUser(${loginUserId}, ${userId}, ${loginUserId})`);
    }

    let container = document.getElementById('userFollowDiv');
    container.innerHTML = '';  // Clear previous button
    container.appendChild(followButton);
}

