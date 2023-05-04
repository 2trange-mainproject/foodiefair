let currentPage = 1;
const pageSize = 5;

// 방문 기록 리스트의 DOM 요소
const visitedListElement = document.getElementById("visited-list");

document.addEventListener("DOMContentLoaded", () => {

    displayVisitedList(userId, currentPage, pageSize);

    const registerVisitedForm = document.getElementById("register-visited-form");
    const registerVisitedBtn = document.getElementById("register-visited-btn");

    registerVisitedForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const visitedContent = registerVisitedForm.visitedContent.value;
        const isSuccess = await registerVisited(userId, visitedContent);
        if (isSuccess) {
            // Reload the visited list
            displayVisitedList(userId, currentPage, pageSize).then(() => {
                // Clear the input field
                registerVisitedForm.visitedContent.value = "";
            });
        } else {
            alert("Error registering visited content");
        }
    });

    registerVisitedBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const visitedContent = registerVisitedForm.visitedContent.value;
        const isSuccess = await registerVisited(userId, visitedContent);
        if (isSuccess) {
            // Reload the visited list
            displayVisitedList(userId, currentPage, pageSize).then(() => {
                // Clear the input field
                registerVisitedForm.visitedContent.value = "";
            });
        } else {
            alert("Error registering visited content");
        }
    });
});

// 페이지 버튼 생성
function createPageButtons(currentPage, totalPages, pageSize) {
    // 페이지네이션 요소 가져오기
    const paginationElement = document.getElementById("pagination");
    // 페이지네이션 요소 초기화
    paginationElement.innerHTML = "";

    // 한 섹션당 페이지 수
    const sectionSize = 5;
    // 전체 섹션 수
    const totalSections = Math.ceil(totalPages / sectionSize);
    // 현재 페이지가 속한 섹션
    const currentSection = Math.floor((currentPage - 1) / sectionSize) + 1;
    // 시작 페이지
    const startPage = (currentSection - 1) * sectionSize + 1;
    // 종료 페이지
    const endPage = Math.min(startPage + sectionSize - 1, totalPages);
    // 이전 페이지 버튼 생성
    const prevPageButton = document.createElement("li");
    prevPageButton.className = "page-item";
    prevPageButton.id = "prev-page";
    prevPageButton.innerHTML = '<a class="page-link  mx-1 " href="#!" aria-label="Previous">\n' +
        '                      <i class="feather-icon icon-chevron-left"></i>\n' +
        '                    </a>';
    paginationElement.appendChild(prevPageButton);

    // 이전 페이지 버튼 클릭 이벤트 추가
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayVisitedList(userId, currentPage, pageSize);
        }
    });

    // 페이지 버튼 생성
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("li");
        pageButton.className = "page-item" + (i === currentPage ? " active" : "");
        pageButton.innerHTML = `<a class="page-link" href="#!" data-page="${i}">${i}</a>`;
        paginationElement.appendChild(pageButton);

        // 페이지 버튼 클릭 이벤트 추가
        pageButton.addEventListener("click", () => {
            displayVisitedList(userId, i, pageSize);
            currentPage = i;
            createPageButtons(currentPage, totalPages, pageSize);
        });
    }

    // 다음 페이지 버튼 생성
    const nextPageButton = document.createElement("li");
    nextPageButton.className = "page-item";
    nextPageButton.id = "next-page";
    nextPageButton.innerHTML = ' <a class="page-link mx-1 text-body" href="#!" aria-label="Next">\n' +
        '                      <i class="feather-icon icon-chevron-right"></i>\n' +
        '                    </a>';
    paginationElement.appendChild(nextPageButton);

    // 다음 페이지 버튼 클릭 이벤트 추가
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

    // 이전/다음 페이지 버튼 보이기
    prevPageButton.style.visibility = "visible";
    nextPageButton.style.visibility = "visible";
}

// 방명록 리스트 표시
async function displayVisitedList(userId, page, pageSize) {
    const response = await fetchVisitedList(userId, page, pageSize);
    const visitedList = response.dataList;
    const totalPages = response.totalPages;

    // 리스트의 DOM 엘리먼트를 초기화
    visitedListElement.innerHTML = '';

    // 방명록 데이터를 이용해 테이블 생성
    visitedList.forEach((visited) => {
        const row = document.createElement("tr");

        // 작성자 닉네임 열 생성
        const writerCell = document.createElement("td");
        writerCell.textContent = visited.userName;
        row.appendChild(writerCell);

        // 방명록 내용 열 생성
        const contentCell = document.createElement("td");
        contentCell.className = "px-14";
        const contentSpan = document.createElement("span");
        contentSpan.className = "text-truncate";
        contentSpan.textContent = visited.visitedContent;
        contentCell.appendChild(contentSpan);
        row.appendChild(contentCell);

        // 날짜 열 생성
        const dateCell = document.createElement("td");
        dateCell.className = "text-end";
        dateCell.textContent = visited.visitedDate;
        row.appendChild(dateCell);

        // 삭제 버튼 dropdown 추가
        const dropdownCell = document.createElement("td");
        dropdownCell.className = "text-end";
        dropdownCell.innerHTML = `
            <div class="dropdown">
            <a href="#" class="text-reset" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="feather-icon icon-more-vertical fs-5"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
<li><a class="dropdown-item" href="#" onclick="deleteVisited(${visited.visitedId}, currentPage, pageSize); return false;"><i class="bi bi-trash me-3"></i>삭제</a></li>
            </ul>
            </div>
            `;
        row.appendChild(dropdownCell);

        // 삭제 버튼 조건에 맞춰 활성화/비활성화
        const dropdownDiv = dropdownCell.querySelector(".dropdown");
        dropdownDiv.style.display = (visited.ownerId === loggedUserId || visited.writerId === loggedUserId) ? "block" : "none";

        visitedListElement.appendChild(row);
    });

    // 페이지 버튼 생성
    createPageButtons(page, totalPages, pageSize);
}

async function fetchVisitedList(userId, page = 1, size = 5) {
    const response = await fetch(`http://localhost:8081/mypage/${userId}/visited?page=${page}&size=${size}`);
    return await response.json();
}

async function registerVisited(ownerId, visitedContent) {
    try {
        const visitedDate = new Date().toISOString().split("T")[0];
        const response = await fetch(`http://localhost:8081/mypage/${ownerId}/visited`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ownerId, writerId: loggedUserId, visitedContent, visitedDate }),
        });

        if (response.ok) {
            return true;
        } else {
            console.error("Error registering visited:", response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Error registering visited:", error);
        return false;
    }
}

async function deleteVisited(visitedId, currentPage, pageSize) {
    try {
        const response = await fetch(`http://localhost:8081/mypage/${userId}/visited/${visitedId}`, {
            method: "DELETE",
        });

        console.log("Backend response:", response);

        if (response.ok) {
            // Reload the visited list
            displayVisitedList(userId, currentPage, pageSize);
        } else {
            alert("Error deleting visited");
        }
    } catch (error) {
        console.error(error);
        alert("Error deleting visited");
    }
}

async function handleDeleteClick(event) {
    event.preventDefault();
    const visitedId = parseInt(event.currentTarget.getAttribute("data-visited-id"));
    await deleteVisited(visitedId);
}

