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
    
    // 1. Detectar si estamos en la carpeta de español
    const isSpanish = window.location.pathname.includes("/es/");
    
    // 2. Elegir el archivo correcto
    // Si estamos en español, cargamos el header traducido. Si no, el normal.
    const headerFile = isSpanish ? "reusable/header_es.html" : "reusable/header.html";

    if (headerPlaceholder) {
        // Usamos BASE para construir la ruta correcta (ej: ../reusable/header_es.html)
        fetch(BASE + headerFile)
        .then((res) => {
            if (!res.ok) throw new Error("No se pudo cargar el header");
            return res.text();
        })
        .then((html) => {
            // Reemplazamos {{BASE}} para que funcionen las imágenes y links
            html = html.replace(/{{BASE}}/g, BASE);
            headerPlaceholder.innerHTML = html;
            
            // Avisamos que el header ya cargó para que corra el menú móvil
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
  const navLinksMobileContainer = navMobile.querySelector(".nav-links-mobile"); // <-- ESTA LÍNEA ES NECESARIA

  // Clonamos los links de navegación (Home, About, Tours, etc.)
  if (navLinksDesktop && navLinksMobileContainer) {
    navLinksMobileContainer.innerHTML = navLinksDesktop.innerHTML;
  }
  
  // 🔴 HEMOS QUITADO LA LÓGICA DE CLONAR LOS BOTONES DE AUTH 🔴
  // El script 'auth.js' ahora se encarga de actualizar AMBOS,
  // el de escritorio (.auth-buttons) y el de móvil (.auth-buttons-mobile).
  // Así ya no hay "peleas".

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


    // =======================================
// ✅ LÓGICA DEL BUSCADOR (CON CONEXIÓN A PYTHON API)
// =======================================

// Variable que contendrá los tours cargados desde el backend (Inicialmente vacía)
let allTours = []; 

// Función para cargar los tours desde tu API de Python
async function loadToursFromAPI() {
    // *** REEMPLAZA ESTA URL CON LA DIRECCIÓN REAL DE TU SERVIDOR PYTHON ***
    // (Asegúrate que tu servidor de Python esté corriendo)
    const API_URL = `${BASE}recommendations/tours/all`; 
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            console.error(`Error HTTP: ${response.status}`);
            return;
        }
        
        const data = await response.json();
        
        allTours = data; 
        console.log(`Tours cargados desde Python: ${allTours.length}`);

        // Una vez que los datos están listos, inicializamos las recomendaciones
        const searchToggleBtns = document.querySelectorAll("#search-toggle-btn-desktop, #search-toggle-btn-mobile");
        if (searchToggleBtns.length > 0) {
            showRecommendations(window.currentUser || null);
        }

    } catch (error) {
        console.error("Error al cargar tours desde la API de Python. Asegúrate que el servidor esté corriendo.", error);
    }
}

// Llama a la función para cargar los tours al iniciar
loadToursFromAPI();

// AHORA seleccionamos ambos botones de lupa (escritorio y móvil)
const searchToggleBtns = document.querySelectorAll("#search-toggle-btn-desktop, #search-toggle-btn-mobile");

const searchModal = document.getElementById("search-modal-container");
const searchCloseBtn = document.getElementById("search-modal-close-btn");
const searchInput = document.getElementById("search-modal-input");
const searchResults = document.getElementById("search-modal-results");
const searchTitle = document.getElementById("search-modal-title");


// Corregimos la condición principal: ahora comprobamos si encontramos ALGÚN botón.
if (searchModal && searchCloseBtn && searchInput && searchResults && searchToggleBtns.length > 0) {

    // 1. Abrir el modal (Asignamos el evento a AMBOS botones)
    searchToggleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            searchModal.style.display = "flex"; // <-- ¡CLAVE! Hace visible el buscador
            searchInput.focus(); 
            
            // --- ✅ ¡PERSONALIZACIÓN AL ABRIR! ---
            if (window.currentUser) {
                // El usuario ESTÁ logueado
                searchTitle.innerHTML = `Hola ${window.currentUser.displayName}, ¿qué buscas?`;
                showRecommendations(window.currentUser);
            } else {
                // El usuario NO está logueado
                searchTitle.innerHTML = "¿A dónde quieres ir?";
                showRecommendations(null);
            }
        });
    });

    // 2. Cerrar el modal
    const closeModal = () => {
        searchModal.style.display = "none";
        searchInput.value = ""; 
        searchResults.innerHTML = "";
    };
    searchCloseBtn.addEventListener("click", closeModal);
    searchModal.addEventListener("click", (e) => {
        if (e.target === searchModal) {
            closeModal(); 
        }
    });
    
    // 3. ¡LA BÚSQUEDA CON RECOMENDACIONES!
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            showRecommendations(window.currentUser);
            return;
        }

        // EL FILTRO AHORA USA LOS DATOS DE PYTHON EN 'allTours'
        let filteredTours = allTours.filter(tour => 
            tour.name.toLowerCase().includes(query) || 
            tour.region.toLowerCase().includes(query)
        );
        
        displayResults(filteredTours, " Resultados de la búsqueda:");
    });
}


// =====================================
// ✅ CONEXIÓN FINAL A LA API DE PYTHON (Reemplaza la lógica anterior)
// =====================================

// Nota: Esta base URL asume que tu frontend y backend están en el mismo dominio o que ya tienes 
// configurado un proxy/CORS si están separados.
const API_BASE_URL = `${window.location.protocol}//${window.location.host}${BASE}recommendations`; 

async function showRecommendations(user) {
    // Si los tours aún no se han cargado (array vacío), no hacer nada
    if (allTours.length === 0) {
        document.getElementById("search-modal-results").innerHTML = 
            '<h4>Cargando datos iniciales...</h4><p>Intenta de nuevo en un momento.</p>';
        return;
    }

    let url;
    let headers = {};
    let title;
    let tourKey; // Clave para obtener el array de tours del JSON de Python

    if (user && user.uid) {
        // --- 1. Usuario Logueado: Pedir Recomendaciones Personalizadas (IA) ---
        
        // 🚨 IMPORTANTE: Necesitas obtener el token JWT que generó tu Flask/Python.
        const token = localStorage.getItem('access_token'); 

        if (!token) {
             // Si falta el token, recurrir a populares (opción NO logueada)
             console.log("Token JWT no encontrado, pidiendo destinos populares.");
             return showRecommendations(null); 
        }

        url = `${API_BASE_URL}/personalized?limit=5`;
        headers = { 'Authorization': `Bearer ${token}` }; // Envía el token al backend
        title = `Tours recomendados para ${user.displayName || 'ti'}`;
        tourKey = 'recommendations'; // La clave que tu endpoint /personalized devuelve
        
    } else {
        // --- 2. Usuario NO Logueado: Pedir Destinos Populares ---
        url = `${API_BASE_URL}/popular?limit=5`;
        title = "Destinos más populares";
        tourKey = 'popular_destinations'; // La clave que tu endpoint /popular devuelve
    }
    
    try {
        const response = await fetch(url, { headers: headers });
        
        if (!response.ok) {
            // Si hay un error de servidor (4xx, 5xx), usamos el fallback
            console.error(`Error al contactar IA (${response.status}). Usando fallback simple.`);
            
            // Usamos la lista local 'allTours' y filtramos por región como fallback
            let fallbackTours = allTours.filter(t => t.region === (user ? "Sierra" : "Costa"));
            return displayResults(fallbackTours, title + " (Reserva)");
        }
        
        const data = await response.json();
        
        // Extrae el array de tours de la clave correcta (la que devuelve tu Python)
        const recommendations = data[tourKey] || []; 
        
        displayResults(recommendations, title);

    } catch (error) {
        console.error("Error al obtener recomendaciones de la API:", error);
        // Muestra un mensaje de error en el modal
        document.getElementById("search-modal-results").innerHTML = 
            `<h4>Error de Conexión</h4><p>No pudimos comunicarnos con el servidor de recomendaciones.</p>`;
    }
}


// Función para mostrar resultados (Ajustada para recibir datos de la API)
function displayResults(tourList, title) {
    const searchResults = document.getElementById("search-modal-results");
    let resultsHTML = `<h4>${title}</h4>`;

    if (tourList.length === 0) {
        resultsHTML += "<p>No se encontraron resultados que coincidan con los criterios.</p>";
    } else {
        resultsHTML += "<ul>";
        tourList.forEach(tour => {
            // Utilizamos 'name' y 'url' (que son las claves filtradas por tu Python)
            const tourName = tour.name || tour.nombre || 'Destino Desconocido';
            const tourUrl = tour.url || `${BASE}toursIndex/${tour.id}.html`; // Fallback para URL

            resultsHTML += `<li><a href="${tourUrl}">${tourName}</a></li>`;
        });
        resultsHTML += "</ul>";
    }
    searchResults.innerHTML = resultsHTML;
}
});


// =====================================
// ✅ SLIDER PRINCIPAL (Tu código original - Sin cambios)
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
// ✅ MENÚ HAMBURGUESA (Tu código original - Sin cambios)
// =====================================
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav-menu-visible');
      
      // ¡LÍNEA AÑADIDA!
      // Añade o quita una clase en el body para controlar los iconos
      // (Nota: 'body' debería estar definido o usar document.body)
      document.body.classList.toggle('no-scroll');
    });
  }
});


// =====================================
// ✅ DROPDOWN EN MÓVIL (Tu código original - Sin cambios)
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


    // --- CÓDIGO PARA LOS ICONOS FLOTANTES DE REDES SOCIALES ---
    // (Tu código original - Sin cambios)
    const basePath = getBasePath();
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
    document.body.insertAdjacentHTML('beforeend', floatingSocialsHTML);
});

// =====================================
// ✅ LÓGICA DE CAMBIO DE IDIOMA (BANDERAS - CORREGIDA para profundidad)
// =====================================
window.switchLanguage = function(targetLang) {
    let path = window.location.pathname;
    const isCurrentlySpanish = path.includes("/es/");
    
    // 1. Manejar la ruta de la carpeta del proyecto (si estás en GitHub Pages)
    const repo = "/SouthAmericansSecrets"; // Tu repo, según getBasePath()
    if (path.startsWith(repo)) {
        path = path.replace(repo, "");
    }

    // 2. Determinar el nombre del archivo (ej: 'index.html', 'post.html')
    let parts = path.split("/").filter(Boolean); // Divide la ruta en partes (ej: ["es", "blog", "post.html"])
    let fileName = parts.pop() || "index.html"; // Última parte es el archivo
    
    // 3. Lógica de Redirección
    if (targetLang === 'es') {
        // --- QUEREMOS ESPAÑOL (ENTRAR EN /es/) ---
        if (!isCurrentlySpanish) {
            // Ir a /es/ + ruta completa (ej: /es/blog/post.html)
            // IMPORTANTE: Aseguramos que la navegación sea correcta desde la raíz.
            let basePath = parts.join("/") || ""; 
            if (basePath) basePath += "/"; // Añadir barra si no es raíz
            
            // Si el archivo estaba en la raíz, va a es/archivo.html. Si no, va a es/carpeta/archivo.html
            window.location.href = BASE + 'es/' + basePath + fileName;
        }
    } else {
        // --- QUEREMOS INGLÉS (SALIR DE /es/) ---
        if (isCurrentlySpanish) {
            // El número de veces que debemos subir (../) es igual al número de carpetas que hay
            // después de "/es/" hasta llegar al archivo.
            
            // Ejemplo: /es/blog/post.html -> parts = ["es", "blog"]
            // Si eliminamos 'es' de la ruta:
            const remainingPathParts = parts.filter(p => p !== 'es');
            
            // Necesitamos subir el número de carpetas restantes, más la carpeta 'es' que ya eliminamos.
            const levelsToAscend = remainingPathParts.length + 1; 

            let pathUp = "../".repeat(levelsToAscend);
            
            // Volvemos a armar la ruta en inglés: /ruta/original/archivo.html
            const originalPath = remainingPathParts.join("/") + "/" + fileName;
            
            window.location.href = pathUp + originalPath;
        }
    }
};
