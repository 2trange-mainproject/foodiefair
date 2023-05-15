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