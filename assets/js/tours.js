// ... (código existente del carrusel) ...

// Event listeners para los botones de navegación
next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

// Iniciar el carrusel
showSlide(0);
startAutoSlide(); // Esto hará que el carrusel se mueva automáticamente