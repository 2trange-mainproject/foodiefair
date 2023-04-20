
$(".que").click(function() {
  $(this).next(".anw").stop().slideToggle(300);
  $(this).toggleClass('on').siblings().removeClass('on');
  /*$(this).next(".anw").siblings(".anw").slideUp(300); // 1개씩 펼치기*/
});


const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === target) {
        content.classList.add('active');
      }
    });
  });
});

accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header');
  const button = item.querySelector('.accordion-button');
  const content = item.querySelector('.accordion-content');

  button.addEventListener('click', () => {
    item.classList.toggle('active');
    button.classList.toggle('active');
    content.classList.toggle('active');
  });
});
