const savedListElement = document.getElementById("saved-list");

document.addEventListener("DOMContentLoaded", () => {
    displaySavedList(userId, loginUserId);

});


// 찜 상품 리스트 표시
//     async function displaySavedList(userId, loginUserId) {
//         const savedList = await fetchSavedList(userId);
//
//     // 이전 내용 지우기
//     savedListElement.innerHTML = '';
//
//     // 저장된 항목 목록을 순회하기
//     savedList.forEach((saved) => {
//         const colDiv = document.createElement("div");
//         colDiv.className = "col";
//
//         const cardDiv = document.createElement("div");
//         cardDiv.className = "card card-product";
//
//         const cardBodyDiv = document.createElement("div");
//         cardBodyDiv.className = "card-body";
//
//         const textCenterDiv = document.createElement("div");
//         textCenterDiv.className = "text-center position-relative";
//
//         // 레이아웃에 따라 다른 요소를 추가하고, 'saved' 객체의 실제 데이터로 플레이스홀더를 교체하세요.
//         // 'saved' 객체의 데이터에 따라 이 요소들을 수정할 수 있습니다.
//
//         // Position-absolute top-0 start-0 요소
//         var festivalText, festivalColor;
//
//         if (saved.productEvent === 1) {
//             festivalText = '신상품';
//             festivalColor = 'pink';
//         } else if (saved.productEvent === 2) {
//             festivalText = '1+1';
//             festivalColor = 'purple';
//         } else if (saved.productEvent === 3) {
//             festivalText = '2+1';
//             festivalColor = 'orange';
//         } else {
//             festivalText = '';
//             festivalColor = '';
//         }
//
//         var fixedTag = JSON.parse(saved.fixedTag).smallCategory;
//
//         const positionAbsoluteDiv = document.createElement("div");
//         positionAbsoluteDiv.className = "position-absolute top-0 start-0";
//         const badgeSpan = document.createElement("span");
//         badgeSpan.className = `badge bg-${festivalColor}`;
//         badgeSpan.textContent = festivalText;
//         positionAbsoluteDiv.appendChild(badgeSpan);
//
//         // 제품 이미지 요소
//         const productLink = document.createElement("a");
//         productLink.href = `viewFood?productId=${saved.productId}`;
//         const productImg = document.createElement("img");
//         productImg.className = "mb-3 img-fluid";
//         productImg.style.maxWidth = "190px";
//         productImg.style.height = "190px";
//         productImg.src = saved.productImg;
//         productLink.appendChild(productImg);
//
//         // Add the fixedTag element
//         const fixedTagDiv = document.createElement("div");
//         fixedTagDiv.className = "text-small mb-1";
//         const fixedTagLink = document.createElement("a");
//         fixedTagLink.href = "javascript:void(0)";
//         fixedTagLink.className = "text-decoration-none text-muted";
//         fixedTagLink.textContent = fixedTag;
//         fixedTagDiv.appendChild(fixedTagLink);
//
// // Add the productName element
//         const productNameH2 = document.createElement("h2");
//         productNameH2.className = "fs-6";
//         const productNameLink = document.createElement("a");
//         productNameLink.href = `viewFood?productId=${saved.productId}`;
//         productNameLink.className = "text-inherit text-decoration-none";
//         productNameLink.textContent = saved.productName;
//         productNameH2.appendChild(productNameLink);
//
// // Add the 조회 (views), 리뷰 (reviews), 찜 (saved) elements
//         const infoDiv = document.createElement("div");
//         infoDiv.innerHTML = `
//     <small class="text-warning"><i class="bi bi-star-fill"></i></small>
//     <span class="text-muted small">조회(<span>${saved.productViews}</span>)</span>
//     <small class="text-warning"><i class="bi bi-star-fill"></i></small>
//     <span class="text-muted small">리뷰(<span>${saved.productReviews}</span>)</span>
//     <small class="text-warning"><i class="bi bi-star-fill"></i></small>
//     <span class="text-muted small">찜(<span>${saved.productSaved}</span>)</span>
// `;
//
// // Add the price and bookmark elements
//         const priceDiv = document.createElement("div");
//         priceDiv.className = "d-flex justify-content-between align-items-center mt-3";
//         const emptyDiv = document.createElement("div");
//         const priceInfoDiv = document.createElement("div");
//         const priceSpan = document.createElement("span");
//         priceSpan.className = "text-dark";
//         priceSpan.textContent = `${saved.productPrice.toLocaleString('ko-KR')}원`;
//         const bookmarkLink = document.createElement("a");
//         bookmarkLink.href = "javascript:void(0)";
//         bookmarkLink.className = "ms-2 btn-action";
//         bookmarkLink.style.color = "deeppink";
//
// // Conditionally display the bookmark button
//         if (parseInt(userId) === parseInt(loginUserId)) {
//             bookmarkLink.innerHTML = "<i class='bi bi-bookmark-fill'></i>";
//         } else {
//             bookmarkLink.style.display = "none";
//         }
//
//         priceInfoDiv.appendChild(priceSpan);
//         priceInfoDiv.appendChild(bookmarkLink);
//         priceDiv.appendChild(emptyDiv);
//         priceDiv.appendChild(priceInfoDiv);
//
// // Append all elements to the card body
//         cardBodyDiv.appendChild(textCenterDiv);
//         cardBodyDiv.appendChild(fixedTagDiv);
//         cardBodyDiv.appendChild(productNameH2);
//         cardBodyDiv.appendChild(infoDiv);
//         cardBodyDiv.appendChild(priceDiv);
//
//         // 원하는 레이아웃을 만들기 위해 요소를 추가
//         textCenterDiv.appendChild(positionAbsoluteDiv);
//         textCenterDiv.appendChild(productLink);
//         cardBodyDiv.appendChild(textCenterDiv);
//         cardDiv.appendChild(cardBodyDiv);
//         colDiv.appendChild(cardDiv);
//
//         savedListElement.appendChild(colDiv);
//
//         bookmarkLink.addEventListener("click", async (event) => {
//             event.preventDefault();
//             if (bookmarkLink.querySelector(".bi-bookmark-fill")) {
//                 await removeSavedProduct(saved.productId, userId); // Use the appropriate savedId property from the saved object
//                 bookmarkLink.innerHTML = "<i class='bi bi-bookmark'></i>";
//             } else {
//                 await registerSavedProduct(saved.productId, userId); // Use the appropriate productId property from the saved object and the userId
//                 bookmarkLink.innerHTML = "<i class='bi bi-bookmark-fill'></i>";
//             }
//         });
//     });
//
// }

async function displaySavedList(userId, loginUserId) {
    const savedList = await fetchSavedList(userId);


    // Clear previous content
    savedListElement.innerHTML = '';

    // Loop through saved items list
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
