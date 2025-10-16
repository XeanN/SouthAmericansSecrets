// =====================================
// ✅ CÁLCULO AUTOMÁTICO DE BASE PATH
// =====================================
function getBasePath() {
  // Ejemplo de rutas:
  // /index.html                  → depth 0 → ""
  // /pages/login.html           → depth 1 → "../"
  // /tour/The Highlands/...     → depth 2 → "../../"

  const path = window.location.pathname;

  // Quitamos el nombre del archivo
  const pathParts = path.split("/").filter(Boolean); // elimina ""

  if (pathParts.length <= 1) {
    return ""; // estamos en raíz
  }

  // Por cada carpeta, subir un nivel
  return "../".repeat(pathParts.length - 1);
}

const BASE = getBasePath();

// =====================================
// ✅ CARGAR HEADER Y FOOTER CON {{BASE}}
// =====================================
document.addEventListener("DOMContentLoaded", function () {
  const headerPlaceholder = document.getElementById("header-placeholder");

  if (headerPlaceholder) {
    fetch(BASE + "reusable/header.html")
      .then((res) => res.text())
      .then((html) => {
        // Reemplazamos {{BASE}} dentro del HTML cargado
        html = html.replace(/{{BASE}}/g, BASE);

        headerPlaceholder.innerHTML = html;

        document.dispatchEvent(new Event("headerLoaded"));
      })
      .catch((err) => console.error("Error al cargar header:", err));
  } else {
    document.dispatchEvent(new Event("headerLoaded"));
  }

  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (footerPlaceholder) {
    fetch(BASE + "reusable/footer.html")
      .then((res) => res.text())
      .then((html) => {
        html = html.replace(/{{BASE}}/g, BASE);
        footerPlaceholder.innerHTML = html;
      })
      .catch((err) => console.error("Error al cargar footer:", err));
  }
});

// =====================================
// ✅ SLIDER PRINCIPAL (igual que antes)
// =====================================
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.dots');
  
  if (!slider) return;

  let currentIndex = 0;
  let autoSlideInterval;
  const SLIDE_INTERVAL_TIME = 5000;

  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.addEventListener('click', () => {
      showSlide(i);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dots .dot');

  function showSlide(index) {
    const newIndex = (index + slides.length) % slides.length;
    slider.style.transform = `translateX(-${newIndex * 100}%)`;

    if (dots.length > 0) {
      dots[currentIndex].classList.remove('active');
      dots[newIndex].classList.add('active');
    }

    currentIndex = newIndex;
    resetAutoSlide();
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, SLIDE_INTERVAL_TIME);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    heroSection.addEventListener('mouseleave', () => startAutoSlide());
  }

  if (slides.length > 0) {
    showSlide(0);
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }
});


// =====================================
// ✅ MENÚ HAMBURGUESA
// =====================================
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav-menu-visible');
    });
  }
});

// =====================================
// ✅ DROPDOWN EN MÓVIL
// =====================================
document.addEventListener('DOMContentLoaded', () => {
  const dropdownToggles = document.querySelectorAll('nav .dropdown > a');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function (event) {
      if (window.innerWidth <= 992) {
        event.preventDefault();
        const nextMenu = this.nextElementSibling;
        if (nextMenu) nextMenu.classList.toggle('active');
      }
    });
  });
});