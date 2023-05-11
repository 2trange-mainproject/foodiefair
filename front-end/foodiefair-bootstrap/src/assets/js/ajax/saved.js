const savedListElement = document.getElementById("saved-list");

document.addEventListener("DOMContentLoaded", () => {
    displaySavedList(userId, loginUserId);
});


// 찜 상품 리스트 표시
    async function displaySavedList(userId, loginUserId) {
        const savedList = await fetchSavedList(userId);

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
        productLink.href = `viewFood?productId=${saved.productId}`;
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
        fixedTagLink.href = "javascript:void(0)";
        fixedTagLink.className = "text-decoration-none text-muted";
        fixedTagLink.textContent = saved.fixedTag;
        fixedTagDiv.appendChild(fixedTagLink);

// Add the productName element
        const productNameH2 = document.createElement("h2");
        productNameH2.className = "fs-6";
        const productNameLink = document.createElement("a");
        productNameLink.href = `viewFood?productId=${saved.productId}`;
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
        bookmarkLink.href = "javascript:void(0)";
        bookmarkLink.className = "ms-2 btn-action";
        bookmarkLink.style.color = "deeppink";

// Conditionally display the bookmark button
        if (parseInt(userId) === parseInt(loginUserId)) {
            bookmarkLink.innerHTML = "<i class='bi bi-bookmark-fill'></i>";
        } else {
            bookmarkLink.style.display = "none";
        }

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

        bookmarkLink.addEventListener("click", async (event) => {
            event.preventDefault();
            if (bookmarkLink.querySelector(".bi-bookmark-fill")) {
                await removeSavedProduct(saved.productId, userId); // Use the appropriate savedId property from the saved object
                bookmarkLink.innerHTML = "<i class='bi bi-bookmark'></i>";
            } else {
                await registerSavedProduct(saved.productId, userId); // Use the appropriate productId property from the saved object and the userId
                bookmarkLink.innerHTML = "<i class='bi bi-bookmark-fill'></i>";
            }
        });
    });

}

async function fetchSavedList(userId) {
    const response = await fetch(`http://localhost:8081/mypage/${userId}/saved-examples`);
    return await response.json();
}

async function removeSavedProduct(productId, userId) {
    const response = await fetch(`http://localhost:8081/products/${productId}/saved?userId=${userId}`, {
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

    const response = await fetch(`http://localhost:8081/products/${productId}/saved`, {
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
