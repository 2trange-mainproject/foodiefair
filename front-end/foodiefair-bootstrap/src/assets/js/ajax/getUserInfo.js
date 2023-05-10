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
            throw new Error('로그인되지 않은 사용자입니다.');
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}