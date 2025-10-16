// =====================================
// ✅ CARGAR HEADER Y FOOTER
// =====================================
document.addEventListener("DOMContentLoaded", function () {
  const headerPlaceholder = document.getElementById("header-placeholder");

  if (headerPlaceholder) {
    fetch("/reusable/header.html")
      .then(response => response.text())
      .then(data => {
        headerPlaceholder.innerHTML = data;

        // ✅ IMPORTANTE: Avisamos que el header ya está listo
        document.dispatchEvent(new Event("headerLoaded"));
      })
      .catch(error => console.error("Error al cargar el header:", error));
  } else {
    // ✅ Si no hay header, igual disparamos el evento
    document.dispatchEvent(new Event("headerLoaded"));
  }

  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (footerPlaceholder) {
    fetch("/reusable/footer.html")
      .then(response => response.text())
      .then(data => {
        footerPlaceholder.innerHTML = data;
      })
      .catch(error => console.error("Error al cargar el footer:", error));
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