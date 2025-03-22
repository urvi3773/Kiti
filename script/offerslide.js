const slides = document.querySelector('.carousel-slides');
const slideCount = document.querySelectorAll('.carousel-slide').length;
const indicators = document.querySelectorAll('.carousel-indicator');
let currentIndex = 0;

document.querySelector('.next').addEventListener('click', () => {
  changeSlide(currentIndex + 1);
});

document.querySelector('.prev').addEventListener('click', () => {
  changeSlide(currentIndex - 1);
});

indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    changeSlide(index);
  });
});

function changeSlide(index) {
  if (index >= slideCount) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = slideCount - 1;
  } else {
    currentIndex = index;
  }

  slides.style.transform = `translateX(-${currentIndex * 100}%)`;

  indicators.forEach(indicator => indicator.classList.remove('active'));
  indicators[currentIndex].classList.add('active');
}

setInterval(() => {
  changeSlide(currentIndex + 1);
}, 5000);

