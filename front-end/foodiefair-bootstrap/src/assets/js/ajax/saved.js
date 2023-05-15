const savedListElement = document.getElementById("saved-list");

document.addEventListener("DOMContentLoaded", () => {
    displaySavedList(userId);

});

async function displaySavedList(userId) {
    const loginUser = await getUserInfo();
    var loginUserId = loginUser.userId;

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
    const response = await fetch(`https://115.85.182.117/mypage/${userId}/saved-examples`);
    return await response.json();
}

async function removeSavedProduct(productId, userId) {
    const response = await fetch(`https://115.85.182.117/products/${productId}/saved/mypage?userId=${userId}`, {
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

    const response = await fetch(`https://115.85.182.117/products/${productId}/saved`, {
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
