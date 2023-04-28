const userId = 1;
const API_BASE_URL = "http://localhost:8081"; // Change this to your server's base URL
// 방문 기록 리스트의 DOM 요소
const visitedListElement = document.getElementById("visited-list");

document.addEventListener("DOMContentLoaded", () => {
    let currentPage = 1;
    const pageSize = 5;

    displayVisitedList(userId, currentPage, pageSize);
});

// 페이지 버튼 생성
function createPageButtons(currentPage, totalPages, pageSize) {
    // 페이지네이션 요소 가져오기
    const paginationElement = document.getElementById("pagination");
    // 페이지네이션 요소 초기화
    paginationElement.innerHTML = "";

    // 한 섹션당 페이지 수
    const sectionSize = 5;
    const totalSections = Math.ceil(totalPages / sectionSize);
    const currentSection = Math.floor((currentPage - 1) / sectionSize) + 1;
    const startPage = (currentSection - 1) * sectionSize + 1;
    const endPage = Math.min(startPage + sectionSize - 1, totalPages);

    const prevPageButton = document.createElement("li");
    prevPageButton.className = "page-item";
    prevPageButton.id = "prev-page";
    prevPageButton.innerHTML = '<a class="page-link" href="#!">Previous</a>';
    paginationElement.appendChild(prevPageButton);

    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayVisitedList(userId, currentPage, pageSize);
        }
    });

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("li");
        pageButton.className = "page-item" + (i === currentPage ? " active" : "");
        pageButton.innerHTML = `<a class="page-link" href="#!" data-page="${i}">${i}</a>`;
        paginationElement.appendChild(pageButton);

        // add event listener to move to the clicked page
        pageButton.addEventListener("click", () => {
            displayVisitedList(userId, i, pageSize);
            currentPage = i;
            createPageButtons(currentPage, totalPages, pageSize);
        });
    }


    const nextPageButton = document.createElement("li");
    nextPageButton.className = "page-item";
    nextPageButton.id = "next-page";
    nextPageButton.innerHTML = '<a class="page-link" href="#!">Next</a>';
    paginationElement.appendChild(nextPageButton);

    nextPageButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayVisitedList(userId, currentPage, pageSize);
        } else if (currentPage === totalPages) {
            const lastPageButton = paginationElement.querySelector(`[data-page="${totalPages}"]`);
            lastPageButton.classList.add("active");
            displayVisitedList(userId, currentPage, pageSize);
        }
    });

    // show prev/next buttons
    prevPageButton.style.visibility = "visible";
    nextPageButton.style.visibility = "visible";
}


async function displayVisitedList(userId, page, pageSize) {
    const response = await fetchVisitedList(userId, page, pageSize);
    const visitedList = response.dataList;
    const totalPages = response.totalPages;

    visitedListElement.innerHTML = '';

    // Create table rows
    visitedList.forEach((visited) => {
        const row = document.createElement("tr");

        const writerCell = document.createElement("td");
        writerCell.textContent = visited.userName; // Update key name
        row.appendChild(writerCell);

        const contentCell = document.createElement("td");
        contentCell.className = "px-14";
        const contentSpan = document.createElement("span");
        contentSpan.className = "text-truncate";
        contentSpan.textContent = visited.visitedContent; // Update key name
        contentCell.appendChild(contentSpan);
        row.appendChild(contentCell);

        const dateCell = document.createElement("td");
        dateCell.className = "text-end";
        dateCell.textContent = visited.visitedDate; // Update key name
        row.appendChild(dateCell);

        visitedListElement.appendChild(row);
    });

    createPageButtons(page, totalPages, pageSize);
}

async function fetchVisitedList(userId, page = 1, size = 5) {
    const response = await fetch(`${API_BASE_URL}/mypage/${userId}/visited?page=${page}&size=${size}`);
    return await response.json();
}

async function registerVisited(userId, visitedContent) {
    try {
        const response = await $.ajax({
            url: `${API_BASE_URL}/mypage/${userId}/visited`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ownerId: userId, visitedContent}),
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
