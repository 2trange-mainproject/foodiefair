fetchUserTags(userId)
    .then(data => {
        displayUserTags(data.userTag); // Access the "userTag" key in the received JSON object
    })
    .catch(error => {
    });

async function fetchUserTags(userId) {
    try {
        const response = await fetch(`http://localhost:8081/mypage/${userId}/userTags`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const responseJson = await response.json(); // Get the JSON object directly

        return responseJson;
    } catch (error) {
        return [];
    }
}

function displayUserTags(userTags) {
    const userTagsDiv = document.getElementById('userTags');
    userTagsDiv.innerHTML = '';

    let row;
    userTags.forEach((tagObj, index) => {
        if (index % 5 === 0) {
            row = document.createElement('div');
            row.className = 'd-flex align-items-center';
            if (index !== 0) {
                row.style.display = 'none';
            }
            userTagsDiv.appendChild(row);
        }

        const tagSpan = document.createElement('span');
        tagSpan.className = 'badge bg-pink me-2 mb-2';
        tagSpan.style.cursor = 'pointer';
        tagSpan.style.fontSize = '2.0ex';
        tagSpan.style.marginRight = '10px !important';
        tagSpan.textContent = `#${tagObj.tag}`;

        row.appendChild(tagSpan);
    });
}
