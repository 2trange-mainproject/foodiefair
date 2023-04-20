var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
document.head.appendChild(script);

var mainCheckbox = document.querySelector('input[type="checkbox"]');
var otherCheckboxes = document.querySelectorAll('input[type="checkbox"]:not(#agree-checkbox)');
var submitButton = document.getElementById('submit-button');

mainCheckbox.addEventListener('change', function() {
    if (mainCheckbox.checked) {
        otherCheckboxes.forEach(function(checkbox) {
            checkbox.checked = true;
        });
    } else {
        otherCheckboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
    }
});

submitButton.addEventListener('click', function(event) {
    if (!document.getElementById('agree-checkbox-1').checked || !document.getElementById('agree-checkbox-2').checked) {
        event.preventDefault();
        Swal.fire({
            icon: 'error',
            text: '필수 체크는 모두 체크해주셔야 합니다.',
            timer: '2000',
            confirmButtonColor: "#d43384"
        });
    }
    else{
        window.location.href = 'signup-2.html';
    }
});