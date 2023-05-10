
$(document).ready(async function () {
    try {
        const followerCount = await fetchFollowCount(userId, 'followers');
        $('#follower-count').text(followerCount);
        $('#followers-tab').text(`팔로워 ${followerCount}명`);

        const followingCount = await fetchFollowCount(userId, 'followings');
        $('#following-count').text(followingCount);
        $('#followings-tab').text(`팔로잉 ${followingCount}명`);

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

// localStorage에 active한 탭 Id를 담아 전달
function setActiveTab(activeTabId) {
    localStorage.setItem('activeTab', activeTabId);
}
