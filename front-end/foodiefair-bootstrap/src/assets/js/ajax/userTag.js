fetchUserTags(userId)
    .then(data => {
        displayUserTags(data.userTag); // Access the "userTag" key in the received JSON object
    })
    .catch(error => {
        console.error('Error displaying user tags:', error);
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
        console.error('Error fetching user tags:', error);
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
        tagSpan.textContent = tagObj.tag;

        row.appendChild(tagSpan);
    });

    // Call the toggleUserTagRows function to hide the rows initially
    // toggleUserTagRows();
}

// function toggleUserTagRows() {
//     const userTagsDiv = document.getElementById('userTags');
//     const rows = userTagsDiv.querySelectorAll('div');
//     for (let i = 1; i < rows.length; i++) {
//         if (rows[i].style.display === 'none') {
//             rows[i].style.display = 'flex';
//         } else {
//             rows[i].style.display = 'none';
//         }
//     }
//
//     // Toggle the button icon between caret-down and caret-up
//     const buttonIcon = document.querySelector('#hideTags svg');
//     if (buttonIcon.classList.contains('bi-caret-down-square-fill')) {
//         buttonIcon.classList.remove('bi-caret-down-square-fill');
//         buttonIcon.classList.add('bi-caret-up-square-fill');
//     } else {
//         buttonIcon.classList.remove('bi-caret-up-square-fill');
//         buttonIcon.classList.add('bi-caret-down-square-fill');
//     }
// }
//
// document.getElementById('hideTags').addEventListener('click', toggleUserTagRows);
