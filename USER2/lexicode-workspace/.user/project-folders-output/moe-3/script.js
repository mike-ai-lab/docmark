const carousel = document.querySelector('.carousel-inner');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');
let currentActive = 0;

prevButton.addEventListener('click', () => {
    carouselItems[currentActive].classList.remove('active');
    currentActive = (currentActive - 1 + carouselItems.length) % carouselItems.length;
    carouselItems[currentActive].classList.add('active');
});

nextButton.addEventListener('click', () => {
    carouselItems[currentActive].classList.remove('active');
    currentActive = (currentActive + 1) % carouselItems.length;
    carouselItems[currentActive].classList.add('active');
});