const userId = 1;
const API_BASE_URL = "http://localhost:8081"; // Change this to your server's base URL

document.addEventListener("DOMContentLoaded", () => {
    displayVisitedList(userId);
});

async function fetchVisitedList(userId, offset = 0, limit = 5) {
    try {
        const response = await $.ajax({
            url: `${API_BASE_URL}/mypage/${userId}/visited`,
            method: "GET",
            dataType: "json",
            data: {
                offset: offset,
                limit: limit,
            },
        });
        return response;
    } catch (error) {
        console.error("Error fetching visited data:", error);
    }
}

async function displayVisitedList(userId) {
    const visitedList = await fetchVisitedList(userId);
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    visitedList.forEach((visited) => {
        const row = document.createElement("tr");

        const writerCell = document.createElement("td");
        writerCell.innerText = visited.userName;
        row.appendChild(writerCell);

        const contentCell = document.createElement("td");
        contentCell.classList.add("px-14");
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("mb-2");
        const contentSpan = document.createElement("span");
        contentSpan.classList.add("text-truncate");
        contentSpan.innerText = visited.visitedContent;
        contentDiv.appendChild(contentSpan);
        contentCell.appendChild(contentDiv);
        row.appendChild(contentCell);

        const dateCell = document.createElement("td");
        dateCell.classList.add("text-end");
        dateCell.innerText = visited.visitedDate;
        row.appendChild(dateCell);

        // Add the rest of the cells for the dropdown and delete button
        // ...

        tbody.appendChild(row);
    });
}

async function registerVisited(userId, visitedContent) {
    try {
        const response = await $.ajax({
            url: `${API_BASE_URL}/mypage/${userId}/visited`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ ownerId: userId, visitedContent }),
        });
        return response.ok;
    } catch (error) {
        console.error("Error registering visited:", error);
    }
}

async function deleteVisited(visitedId) {
    try {
        const response = await $.ajax({
            url: `${API_BASE_URL}/mypage/visited?visitedId=${visitedId}`,
            method: "DELETE",
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting visited:", error);
    }
}

// Event listeners for the register button and delete button(s)
// ...
