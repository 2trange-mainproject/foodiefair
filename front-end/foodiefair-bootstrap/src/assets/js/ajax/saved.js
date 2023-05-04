let currentPage = 1;
const pageSize = 16;

const savedListElement = document.getElementById("saved-list");

document.addEventListener("DOMContentLoaded", () => {

    displaySavedList(userId, currentPage, pageSize);

});


// 찜 상품 리스트 표시
async function displaySavedList(userId, page, pageSize) {
    const response = await fetchSavedList(userId, page, pageSize);
    const savedList = response.dataList;
    const totalPages = response.totalPages;

    // 이전 내용 지우기
    savedListElement.innerHTML = '';

    // 저장된 항목 목록을 순회하기
    savedList.forEach((saved) => {
        const colDiv = document.createElement("div");
        colDiv.className = "col";

        const cardDiv = document.createElement("div");
        cardDiv.className = "card card-product";

        const cardBodyDiv = document.createElement("div");
        cardBodyDiv.className = "card-body";

        const textCenterDiv = document.createElement("div");
        textCenterDiv.className = "text-center position-relative";

        // 레이아웃에 따라 다른 요소를 추가하고, 'saved' 객체의 실제 데이터로 플레이스홀더를 교체하세요.
        // 'saved' 객체의 데이터에 따라 이 요소들을 수정할 수 있습니다.

        // Position-absolute top-0 start-0 요소
        const positionAbsoluteDiv = document.createElement("div");
        positionAbsoluteDiv.className = "position-absolute top-0 start-0";
        const badgeSpan = document.createElement("span");
        badgeSpan.className = `badge bg-${saved.festivalColor}`;
        badgeSpan.textContent = saved.festivalText;
        positionAbsoluteDiv.appendChild(badgeSpan);

        // 제품 이미지 요소
        const productLink = document.createElement("a");
        productLink.href = `shop-single.html?productId=${saved.productId}`;
        const productImg = document.createElement("img");
        productImg.className = "mb-3 img-fluid";
        productImg.style.maxWidth = "220px";
        productImg.style.maxHeight = "220px";
        productImg.src = saved.productImg;
        productLink.appendChild(productImg);

        // Add the fixedTag element
        const fixedTagDiv = document.createElement("div");
        fixedTagDiv.className = "text-small mb-1";
        const fixedTagLink = document.createElement("a");
        fixedTagLink.href = "#";
        fixedTagLink.className = "text-decoration-none text-muted";
        fixedTagLink.textContent = saved.fixedTag;
        fixedTagDiv.appendChild(fixedTagLink);

// Add the productName element
        const productNameH2 = document.createElement("h2");
        productNameH2.className = "fs-6";
        const productNameLink = document.createElement("a");
        productNameLink.href = `shop-single.html?productId=${saved.productId}`;
        productNameLink.className = "text-inherit text-decoration-none";
        productNameLink.textContent = saved.productName;
        productNameH2.appendChild(productNameLink);

// Add the 조회 (views), 리뷰 (reviews), 찜 (saved) elements
        const infoDiv = document.createElement("div");
        infoDiv.innerHTML = `
    <small class="text-warning"><i class="bi bi-star-fill"></i></small>
    <span class="text-muted small">조회(<span>${saved.productViews}</span>)</span>
    <small class="text-warning"><i class="bi bi-star-fill"></i></small>
    <span class="text-muted small">리뷰(<span>${saved.productReviews}</span>)</span>
    <small class="text-warning"><i class="bi bi-star-fill"></i></small>
    <span class="text-muted small">찜(<span>${saved.productSaved}</span>)</span>
`;

// Add the price and bookmark elements
        const priceDiv = document.createElement("div");
        priceDiv.className = "d-flex justify-content-between align-items-center mt-3";
        const emptyDiv = document.createElement("div");
        const priceInfoDiv = document.createElement("div");
        const priceSpan = document.createElement("span");
        priceSpan.className = "text-dark";
        priceSpan.textContent = `${saved.productPrice}원`;
        const bookmarkLink = document.createElement("a");
        bookmarkLink.href = "#";
        bookmarkLink.className = "ms-2 btn-action";
        bookmarkLink.style.color = "deeppink";
        bookmarkLink.innerHTML = "<i class='bi bi-bookmark'></i>";
        priceInfoDiv.appendChild(priceSpan);
        priceInfoDiv.appendChild(bookmarkLink);
        priceDiv.appendChild(emptyDiv);
        priceDiv.appendChild(priceInfoDiv);

// Append all elements to the card body
        cardBodyDiv.appendChild(textCenterDiv);
        cardBodyDiv.appendChild(fixedTagDiv);
        cardBodyDiv.appendChild(productNameH2);
        cardBodyDiv.appendChild(infoDiv);
        cardBodyDiv.appendChild(priceDiv);

        // 원하는 레이아웃을 만들기 위해 요소를 추가
        textCenterDiv.appendChild(positionAbsoluteDiv);
        textCenterDiv.appendChild(productLink);
        cardBodyDiv.appendChild(textCenterDiv);
        cardDiv.appendChild(cardBodyDiv);
        colDiv.appendChild(cardDiv);

        savedListElement.appendChild(colDiv);
    });

    // 페이지 버튼 생성
    createPageButtons(page, totalPages, pageSize);
}

async function fetchSavedList(userId, page = 1, size = 16) {
    const response = await fetch(`http://localhost:8081/mypage/${userId}/saved-products?page=${page}&size=${size}`);
    return await response.json();
}

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
    prevPageButton.innerHTML = '<a class="page-link  mx-1 " href="#" aria-label="Previous">\n' +
        '                      <i class="feather-icon icon-chevron-left"></i>\n' +
        '                    </a>';
    paginationElement.appendChild(prevPageButton);

    // 이전 페이지 버튼 클릭 이벤트 추가
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displaySavedList(userId, currentPage, pageSize);
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
            displaySavedList(userId, i, pageSize);
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
            displaySavedList(userId, currentPage, pageSize);
        } else if (currentPage === totalPages) {
            const lastPageButton = paginationElement.querySelector(`[data-page="${totalPages}"]`);
            lastPageButton.classList.add("active");
            displaySavedList(userId, currentPage, pageSize);
        }
    });

    // 이전/다음 페이지 버튼 보이기
    prevPageButton.style.visibility = "visible";
    nextPageButton.style.visibility = "visible";
}
