// =====================================
// ✅ CÁLCULO AUTOMÁTICO DE BASE PATH (compatible con GitHub Pages)
// =====================================
function getBasePath() {
  let path = window.location.pathname;

  // Detectar si está en GitHub Pages
  const repo = "/SouthAmericansSecrets";

  // Si la ruta comienza con el nombre del repo, lo quitamos
  if (path.startsWith(repo)) {
    path = path.replace(repo, "");
  }

  // Dividir en partes
  const parts = path.split("/").filter(Boolean); // ["toursIndex", "Lima.html"]

  if (parts.length <= 1) {
    return ""; // Estamos en raíz del proyecto
  }

  // Por cada carpeta, subir un nivel
  return "../".repeat(parts.length - 1);
}

const BASE = getBasePath();


// =====================================
// ✅ CARGAR HEADER Y FOOTER
// =====================================
document.addEventListener("DOMContentLoaded", function () {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    fetch(BASE + "reusable/header.html")
      .then((res) => res.text())
      .then((html) => {
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

// =======================================================
// ✅ LÓGICA PARA EL MENÚ MÓVIL (VERSIÓN FINAL CORREGIDA)
// =======================================================
document.addEventListener("headerLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMobile = document.querySelector(".nav-mobile");

  // Si no encuentra los elementos, no hace nada para evitar errores.
  if (!navToggle || !navMobile) return;

  // --- CLONACIÓN DE ELEMENTOS ---
  const navLinksDesktop = document.querySelector(".nav-desktop .nav-links");
  const authButtonsDesktop = document.querySelector(".header .auth-buttons");
  const navLinksMobileContainer = navMobile.querySelector(".nav-links-mobile");
  const authButtonsMobileContainer = navMobile.querySelector(".auth-buttons-mobile");

  // Clonamos los links de navegación
  if (navLinksDesktop && navLinksMobileContainer) {
    navLinksMobileContainer.innerHTML = navLinksDesktop.innerHTML;
  }
  // Clonamos los botones de Login/Register
  if (authButtonsDesktop && authButtonsMobileContainer) {
    authButtonsMobileContainer.innerHTML = authButtonsDesktop.innerHTML;
  }

  // --- LÓGICA PARA ABRIR Y CERRAR EL MENÚ PRINCIPAL ---
  navToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });

  // --- LÓGICA PARA LOS SUBMENÚS (SOLO CON TOQUE/CLICK) ---
  const dropdownTogglesMobile = navMobile.querySelectorAll(".dropdown > a");

  dropdownTogglesMobile.forEach(toggle => {
    toggle.addEventListener("click", function(event) {
        // Prevenimos que el enlace navegue a otra página
        event.preventDefault(); 
        
        const parentDropdown = this.parentElement;
        const nextMenu = this.nextElementSibling;
        
        // Cerrar cualquier otro submenú que esté abierto
        parentDropdown.parentElement.querySelectorAll('.dropdown.active').forEach(otherDropdown => {
            if (otherDropdown !== parentDropdown) {
                otherDropdown.classList.remove('active');
                otherDropdown.querySelector('.dropdown-menu, .mega-menu')?.classList.remove('active');
            }
        });

        // Abrir/Cerrar el submenú actual
        parentDropdown.classList.toggle("active");
        if (nextMenu) {
            nextMenu.classList.toggle("active");
        }
    });
  });
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
      
      // ¡LÍNEA AÑADIDA!
      // Añade o quita una clase en el body para controlar los iconos
      body.classList.toggle('no-scroll');
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

/* ==========================================================================
  COMPONENTES DINÁMICOS - Versión Universal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /**
     * Función para obtener la ruta raíz del sitio, sin importar el hosting.
     * Funciona tanto en un dominio principal (ej: misitio.com) como en 
     * un subdirectorio (ej: usuario.github.io/mi-repo/).
     * @returns {string} La ruta base correcta para los assets (ej: "/" o "/mi-repo/").
     */
    function getBasePath() {
        const repoName = 'SouthAmericansSecrets'; // IMPORTANTE: El nombre de tu repositorio de GitHub.
        const path = window.location.pathname;

        // Comprueba si la URL contiene el nombre del repositorio (caso de GitHub Pages)
        if (path.includes(`/${repoName}/`)) {
            return `/${repoName}/`;
        }

        // Para cualquier otro hosting (donde tu web está en la raíz)
        return '/';
    }

    // --- CÓDIGO PARA LOS ICONOS FLOTANTES DE REDES SOCIALES ---

    // 1. Obtener la ruta base correcta
    const basePath = getBasePath();

    // 2. Define el HTML de los iconos flotantes usando la nueva ruta base.
    // Nota que ahora la ruta empieza desde la raíz del sitio.
    const floatingSocialsHTML = `
        <div class="floating-socials">
            <a href="https://www.tripadvisor.com/Attraction_Review-g445063-d6387633-Reviews-South_Americans_Secrets-Paracas_Ica_Region.html" target="_blank" aria-label="TripAdvisor">
                <img src="${basePath}assets/img/redesSociales/tripadvisor.png" alt="TripAdvisor">
            </a>
            <a href="https://www.facebook.com/SouthAmericansSecrets" target="_blank" aria-label="Facebook">
                <img src="${basePath}assets/img/redesSociales/FB.png" alt="Facebook">
            </a>
            <a href="https://www.getyourguide.es/south-americans-secrets-eirl-s353664" target="_blank" aria-label="Getyourguide">
                <img src="${basePath}assets/img/redesSociales/getvi.png" alt="Getyourguide">
            </a>
            <a href="https://wa.me/51947058508" target="_blank" aria-label="WhatsApp">
                <img src="${basePath}assets/img/redesSociales/ws1.png" alt="WhatsApp">
            </a>
            <a href="https://www.instagram.com/southamericanssecrets/?hl=es" target="_blank" aria-label="Instagram">
                <img src="${basePath}assets/img/redesSociales/instagram.png" alt="Instagram">
            </a>
        </div>
    `;

    // 3. Inserta el HTML en el cuerpo (body) de la página
    document.body.insertAdjacentHTML('beforeend', floatingSocialsHTML);
});