// Esperamos a que todo el HTML esté cargado antes de ejecutar el script. Es una buena práctica.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELECCIÓN DE ELEMENTOS ---
    // Seleccionamos solo los elementos que existen en nuestro nuevo HTML.
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots');
    
    // Si no hay un slider en la página, detenemos el script para evitar errores.
    if (!slider) {
        return;
    }

    // --- 2. CONFIGURACIÓN ---
    let currentIndex = 0;
    let autoSlideInterval;
    const SLIDE_INTERVAL_TIME = 5000; // 5 segundos, en una constante para fácil configuración.

    // --- 3. CREACIÓN DE DOTS (CORREGIDO) ---
    // Creamos un dot por cada slide que exista.
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        // ¡LA CORRECCIÓN CLAVE! Añadimos la clase '.dot' que faltaba.
        dot.classList.add('dot'); 
        dot.addEventListener('click', () => {
            showSlide(i);
        });
        dotsContainer.appendChild(dot);
    });

    // Ahora sí podemos seleccionar los dots recién creados.
    const dots = document.querySelectorAll('.dots .dot');

    // --- 4. FUNCIONES DEL SLIDER ---
    function showSlide(index) {
        // Lógica para que el slider sea cíclico (vuelva al inicio/final).
        const newIndex = (index + slides.length) % slides.length;

        // Movemos el contenedor del slider.
        slider.style.transform = `translateX(-${newIndex * 100}%)`;

        // Actualizamos la clase 'active' solo en el dot actual y el nuevo. Es más eficiente.
        if (dots.length > 0) {
            dots[currentIndex].classList.remove('active');
            dots[newIndex].classList.add('active');
        }

        currentIndex = newIndex;
        
        // Reiniciamos el temporizador con cada cambio manual para una mejor UX.
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

    // --- 5. EVENTOS Y EJECUCIÓN INICIAL ---
    // Pausar el slider al pasar el ratón por encima del contenedor hero.
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        heroSection.addEventListener('mouseleave', () => startAutoSlide());
    }

    // Iniciar el carrusel en el primer slide.
    if (slides.length > 0) {
        showSlide(0);
        // Desactivamos el reinicio inicial para que no se adelante el primer slide
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
});
// Lógica para el menú de hamburguesa
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('nav'); // Seleccionamos todo el <nav>

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav-menu-visible');
});