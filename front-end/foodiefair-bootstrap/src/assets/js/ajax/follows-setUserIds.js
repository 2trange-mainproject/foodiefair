let userId;
let loginUserId;

function getUserIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userId");
}

async function getUserInfo() {
    try {
        const response = await fetch('http://localhost:8081/get-user-info', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        });

        if (response.ok) {
            return await response.json();
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}


userId = getUserIdFromUrl();
getUserInfo().then(data => {
    loginUserId = data.userId;
});
