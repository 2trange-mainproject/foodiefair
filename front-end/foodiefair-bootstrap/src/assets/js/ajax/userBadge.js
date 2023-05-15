fetchUserBadges(userId)
    .then(data => {
        displayUserBadges(data); // Pass the entire JSON object
    })
    .catch(error => {
        console.error('Error displaying user badges:', error);
    });

async function fetchUserBadges(userId) {
    try {
        const response = await fetch(`https://115.85.183.196:8081/mypage/${userId}/userBadges`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const responseJson = await response.json(); // Get the JSON object directly

        return responseJson;
    } catch (error) {
        console.error('Error fetching user badges:', error);
        return {};
    }
}

function displayUserBadges(userBadges) {
    const userBadgesDiv = document.getElementById('userBadges');
    userBadgesDiv.innerHTML = '';

    let row;
    let index = 0;
    for (const key in userBadges) {
        if (index % 5 === 0) {
            row = document.createElement('div');
            row.className = 'd-flex align-items-center';
            if (index !== 0) {
                row.style.display = 'none';
            }
            userBadgesDiv.appendChild(row);
        }

        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'badge bg-pink me-2 mb-2';
        badgeSpan.style.cursor = 'pointer';
        badgeSpan.style.fontSize = '2.0ex';
        badgeSpan.textContent = `#${key} ${userBadges[key]}`;

        row.appendChild(badgeSpan);
        index++;
    }

}
