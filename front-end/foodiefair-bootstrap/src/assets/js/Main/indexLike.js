async function loadLikes(page, sortOrder) {
    var userId = null;

    // food.html 페이지의 JavaScript 코드
    const searchKeyword = localStorage.getItem('searchKeyword');

    var queryString = `?page=${page}&size=15&sortOrder=popularity`;

    if (userId) {
        queryString += `&userId=${userId}`;
    }

    if (searchKeyword) {
        queryString += `&searchKeyword=${encodeURIComponent(searchKeyword)}`;
    }

    $.ajax({
        url: `http://115.85.182.117:8081/api/food-list${queryString}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response.dtoList;

            renderLikes(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function renderLikes(data) {
    var $likeContainer = $('#likeContainer');
    $likeContainer.empty();
    var likeHtml = '';

    $.each(data, function(index, like) {
        if (index < 3) {
            likeHtml += `
            <a href="pages/viewFood?productId=${like.productId}">
                <img src="${like.productImg}" class="circle-img">
            </a>
        `;
        } else {
            return false;
        }
    });

    var likeListHtml = `
        ${likeHtml}
    `;

    $likeContainer.append(likeListHtml);
}

$(document).ready(function () {
    loadLikes(1, $(".form-select").val());
});
