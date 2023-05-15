let userId;
let loginUserId = null;

function getUserIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userId");
}
userId = getUserIdFromUrl();
getUserInfo().then(data => {
    if (data) { // 로그인 데이터가 있을 때
        loginUserId = data.userId;
    } else { // 로그인 데이터가 없을 때
        loginUserId = null;
    }
});


fetch(`https://115.85.183.196:8081/user-read/${userId}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('userImg').src = data.userRead.userImg;
        document.getElementById('userName').innerHTML = data.userRead.userName;
        document.getElementById('userBadge').innerHTML = data.badgeRead.selectedBadge;
    })
    .catch(error => {
        console.error(error);
    });

const mypageSaved = document.getElementById('mypage-saved');
mypageSaved.href = `${mypageSaved.href}?userId=${userId}`;
const mypageReviews = document.getElementById('mypage-reviews');
mypageReviews.href = `${mypageReviews.href}?userId=${userId}`;



