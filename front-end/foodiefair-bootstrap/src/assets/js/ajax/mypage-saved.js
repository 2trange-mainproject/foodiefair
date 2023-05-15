let currentPage = 1;
const pageSize = 16;

const savedListElement = document.getElementById("saved-list");
const productNumElement = document.getElementById("productNum");

document.addEventListener("DOMContentLoaded", () => {

    displaySavedList(userId, currentPage, pageSize);
    displayProductNum(userId);

});


// 찜 상품 리스트 표시
async function displaySavedList(userId, page, pageSize) {
    const loginUser = await getUserInfo();
    var loginUserId = loginUser.userId;

    const response = await fetchSavedList(userId, page, pageSize);
    const savedList = response.dataList;
    const totalPages = response.totalPages;

    // 이전 내용 지우기
    savedListElement.innerHTML = '';

    // 저장된 항목 목록을 순회하기
    savedList.forEach((saved) => {
        var festivalText, festivalColor;

        if (saved.productEvent === 1) {
            festivalText = '신상품';
            festivalColor = 'pink';
        } else if (saved.productEvent === 2) {
            festivalText = '1+1';
            festivalColor = 'purple';
        } else if (saved.productEvent === 3) {
            festivalText = '2+1';
            festivalColor = 'orange';
        } else {
            festivalText = '';
            festivalColor = '';
        }

        var fixedTag = JSON.parse(saved.fixedTag).smallCategory;

        var productHtml = '';
        productHtml += `
            <div class="col">
                <div class="card card-product">
                    <div class="card-body">
                        <div class="text-center position-relative">
                            <div class="position-absolute top-0 start-0">
                                <span class="badge bg-${festivalColor}">${festivalText}</span>
                            </div>
                            <a href="viewFood?productId=${saved.productId}">
                                <img class="mb-3 img-fluid" style="max-width: 190px; height: 190px;" src="${saved.productImg}">
                            </a>
                        </div>
                        <div class="text-small mb-1"><a href="javascript:void(0)" class="text-decoration-none text-muted">${fixedTag}</a></div>
                        <h2 class="fs-6" title="${saved.productName}"><a href="viewFood?productId=${saved.productId}" class="text-inherit text-decoration-none">${saved.productName}</a></h2>
                        <div>
                            <small class="text-warning"><i class="bi bi-star-fill"></i></small>
                            <span class="text-muted small">조회(<span>${saved.productViews}</span>)</span>
                            <small class="text-warning"><i class="bi bi-star-fill"></i></small>
                            <span class="text-muted small">리뷰(<span>${saved.productReviews}</span>)</span>
                            <small class="text-warning"><i class="bi bi-star-fill"></i></small>
                            <span class="text-muted small">찜(<span>${saved.productSaved}</span>)</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div></div>
                            <div>
                                <span class="text-dark">${saved.productPrice.toLocaleString('ko-KR')}원</span>`;
        if (parseInt(userId) === parseInt(loginUserId)) {
            productHtml += `<a href="javascript:void(0)" class="ms-2 btn-action" style="color: deeppink" onclick="toggleBookmark(event, '${saved.productId}', '${userId}', '${loginUserId}')">
                <i class='bi bi-bookmark-fill'></i>
            </a>`;
        }

        productHtml += `</div>
                    </div>
                </div>
            </div>
        `;
        savedListElement.innerHTML += productHtml;
    });

    // 페이지 버튼 생성
    createPageButtons(page, totalPages, pageSize);
}

async function toggleBookmark(event, productId, userId, loginUserId) {
    if (parseInt(userId) === parseInt(loginUserId)) {
        const element = event.currentTarget;
        const icon = element.querySelector('i');
        if (icon.classList.contains('bi-bookmark-fill')) {
            await removeSavedProduct(productId, userId);
            icon.classList.remove('bi-bookmark-fill');
            icon.classList.add('bi-bookmark');
        } else {
            await registerSavedProduct(productId, userId);
            icon.classList.remove('bi-bookmark');
            icon.classList.add('bi-bookmark-fill');
        }
    }
}

async function fetchSavedList(userId, page = 1, size = 16) {
    const response = await fetch(`https://www.foodiefair.shop/mypage/${userId}/saved-products?page=${page}&size=${size}`);
    return await response.json();
}

async function removeSavedProduct(productId, userId) {
    const response = await fetch(`https://www.foodiefair.shop/products/${productId}/saved/mypage?userId=${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        console.log('Delete success');
    } else {
        console.error('Failed to remove saved product');
    }
}

async function registerSavedProduct(productId, userId) {
    const savedDTO = {
        productId: productId,
        userId: userId,
    };

    const response = await fetch(`https://www.foodiefair.shop/products/${productId}/saved/mypage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(savedDTO),
    });

    if (response.ok) {
        console.log('Save success');
    } else {
        console.error('Failed to add saved product');
    }
}

async function displayProductNum(userId) {
    const productCount = await fetchProductCount(userId);
    productNumElement.textContent = productCount;
}

async function fetchProductCount(userId) {
    const response = await fetch(`https://www.foodiefair.shop/mypage/${userId}/saved-products/count`);
    return await response.text();
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
    prevPageButton.innerHTML = '<a class="page-link  mx-1 " href="javascript:void(0)" aria-label="Previous">\n' +
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
        pageButton.innerHTML = `<a class="page-link" href="javascript:void(0)" data-page="${i}">${i}</a>`;
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
    nextPageButton.innerHTML = ' <a class="page-link mx-1 text-body" href="javascript:void(0)" aria-label="Next">\n' +
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
