$(document).ready(function() {
    // getUserInfo();

    $("#userModifyBtn").click(function(e) {
        e.preventDefault();

        // Get the entered information
        let userName = $("#userName").val();
        let userEmail = loginUser.userEmail;
        let userPwd = (loginUser.userPwd);
        let userIntro = $("#userIntro").val();
        let formData = new FormData();
        formData.append("userName", userName);
        formData.append("userEmail", userEmail);
        formData.append("userPwd", userPwd);
        formData.append("userIntro", userIntro);
        formData.append("userImg", $("#userImg")[0].files[0]);

        // Add userTags as JSON Array
        const userTagsArray = tags.map(tag => {
            return { "userTag": tag };
        });

        const userTagsObject = {
            "userTag": userTagsArray
        };

        formData.set('userTag', JSON.stringify(userTagsObject));

        $.ajax({
            type: "POST",
            url: "http://115.85.182.117:8081/user/modify",
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                // if (result.success) {
                //     alert(result.message);
                //     location.href = "/pages/mypage"
                // } else {
                //     alert(result.message);
                // }
                alert(result.message);
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
                alert(xhr.responseJSON.message);
            }
        });
    });
});


const tags = [];
const tagsContainer = document.querySelector('.tags-container');

document.getElementById("mytag").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (tags.length < 10 && this.value.trim() !== "") {
            const tag = this.value.trim();
            if (tag && !tags.includes(tag)) {
                tags.push(tag);
                displayTags();
            }
            this.value = "";
        } else {
            alert("You can enter up to 10 tags.");
        }
    }
});

function displayTags() {
    tagsContainer.innerHTML = "";
    tags.forEach((tag, index) => {
        const tagElement = document.createElement("span");
        tagElement.classList.add("badge");
        tagElement.classList.add("bg-pink");
        tagElement.classList.add("me-2");
        tagElement.classList.add("mb-2");
        tagElement.textContent = "#" + tag;
        tagElement.style.cursor = "pointer";

        tagElement.addEventListener("click", () => {
            tags.splice(index, 1);
            displayTags();
        });

        tagsContainer.appendChild(tagElement);
    });
}

// function getUserInfo() {
//     $.ajax({
//         type: "GET",
//         url: "http://115.85.182.117:8081/signup",
//         dataType: "json",
//         success: function (result) {
//             if (result.success) {
//                 // Update the form fields with the existing data
//                 updateFormFields(result.data);
//             } else {
//                 alert(result.message);
//             }
//         },
//         error: function (xhr, status, error) {
//             console.error(xhr.responseText);
//             alert(xhr.responseJSON.message);
//         }
//     });
// }

function updateFormFields(data) {
    // Update the user name field
    document.getElementById('userName').value = data.userName;

    // Update the profile picture preview
    if (data.userImg) {
        document.getElementById('preview').src = data.userImg;
    }

    // Update the tags input and display
    tags.length = 0;
    data.userTags.forEach(tagData => {
        tags.push(tagData.tag);
    });
    displayTags();

    // Update the self-introduction textarea
    document.getElementById('userIntro').value = data.userIntro;
}

// Function to read and display the selected image file
function readURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $("#preview").attr("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

document.getElementById("userImg").addEventListener("change", function () {
    readURL(this);
});
