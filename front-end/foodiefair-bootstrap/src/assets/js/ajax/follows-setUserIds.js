let userId;
let loginUserId;

function getUserIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userId");
}

async function getUserInfo() {
    try {
        const response = await fetch('https://www.foodiefair.shop/get-user-info', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.log('로그인되지 않은 사용자입니다.');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}


userId = getUserIdFromUrl();
getUserInfo().then(data => {
    loginUserId = data.userId;
});
console.log(loginUserId);
console.log(userId);
