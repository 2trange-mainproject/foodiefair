// Password js
var password = document.getElementById('password');
var password2 = document.getElementById('password-confirm');
var toggler = document.getElementById('passwordToggler');
var toggler2 = document.getElementById('passwordToggler2');

showHidePassword = () => {
  if (password.type == 'password') {
    password.setAttribute('type', 'text');
    toggler.classList.add('bi-eye');
    toggler.classList.remove('bi-eye-slash');
  } else {
    toggler.classList.remove('bi-eye')
    toggler.classList.add('bi-eye-slash');
    password.setAttribute('type', 'password');
  }
};

showHidePassword2 = () => {
  if (password2.type == 'password') {
    password2.setAttribute('type', 'text');
    toggler2.classList.add('bi-eye');
    toggler2.classList.remove('bi-eye-slash');
  } else {
    toggler2.classList.remove('bi-eye')
    toggler2.classList.add('bi-eye-slash');
    password2.setAttribute('type', 'password');
  }
};

toggler.addEventListener('click', showHidePassword);
toggler2.addEventListener('click', showHidePassword2);

//프로필 업로드
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('preview').src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    document.getElementById('preview').src = "";
  }
}