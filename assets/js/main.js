const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let currentIndex = 0;

// Crear dots dinámicamente
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.addEventListener('click', () => showSlide(i));
  dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll('.dots span');

function showSlide(index){
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - index) * 100}%)`;
    s.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
  });
  currentIndex = index;
}
function nextSlide(){ showSlide((currentIndex+1)%slides.length); }
function prevSlide(){ showSlide((currentIndex-1+slides.length)%slides.length); }

next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

showSlide(0);
