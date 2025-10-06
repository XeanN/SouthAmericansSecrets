document.addEventListener('DOMContentLoaded', () => {

    const carouselItems = document.querySelectorAll('.carousel-item');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    
    // Si no existen los elementos del carrusel, detenemos el script.
    if (carouselItems.length === 0) return; 

    let currentIndex = 0;
    const intervalTime = 5000; // 5 segundos

    function updateCarousel(index) {
        carouselItems.forEach((item, i) => {
            item.classList.remove('active', 'prev', 'next');
            if (i === index) {
                item.classList.add('active');
            } else if (i === (index - 1 + carouselItems.length) % carouselItems.length) {
                item.classList.add('prev');
            } else if (i === (index + 1) % carouselItems.length) {
                item.classList.add('next');
            }
        });

        const dots = document.querySelectorAll('.carousel-dots .dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }

    function startAutoSlide() {
        return setInterval(() => {
            const newIndex = (currentIndex + 1) % carouselItems.length;
            updateCarousel(newIndex);
        }, intervalTime);
    }

    let slideInterval = startAutoSlide();

    // Detener el carrusel automático al interactuar con él
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        slideInterval = startAutoSlide();
    });

    // Crear los puntos de navegación
    carouselItems.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            updateCarousel(i);
            slideInterval = startAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });

    // Event listeners para los botones de navegación
    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        const newIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        updateCarousel(newIndex);
        slideInterval = startAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        const newIndex = (currentIndex + 1) % carouselItems.length;
        updateCarousel(newIndex);
        slideInterval = startAutoSlide();
    });

    // Llamada inicial
    updateCarousel(0);
});

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu'); // Cambio clave aquí

    // Verifica que ambos elementos existen antes de agregar el evento
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav-menu-visible');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const addToCartBtn = document.getElementById('addToCartBtn');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            // 1. Recoger los datos del tour desde los atributos data-*
            const tour = {
                id: addToCartBtn.dataset.id,
                name: addToCartBtn.dataset.name,
                price: parseFloat(addToCartBtn.dataset.price),
                image: addToCartBtn.dataset.image,
                quantity: 1 // Siempre empezamos agregando 1
            };

            // 2. Obtener el carrito actual de localStorage (o crear uno nuevo si no existe)
            // Usamos JSON.parse para convertir el texto guardado en un objeto JavaScript
            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

            // 3. Revisar si el tour ya está en el carrito
            const existingTour = cart.find(item => item.id === tour.id);
            if (existingTour) {
                // Si ya existe, solo aumentamos la cantidad
                existingTour.quantity++;
            } else {
                // Si es nuevo, lo añadimos al carrito
                cart.push(tour);
            }

            // 4. Guardar el carrito actualizado de vuelta en localStorage
            // Usamos JSON.stringify para convertir el objeto en texto antes de guardarlo
            localStorage.setItem('shoppingCart', JSON.stringify(cart));

            // 5. Avisar al usuario que el producto fue agregado
            alert(`${tour.name} ha sido añadido a tu carrito!`);
            
            // Opcional: Redirigir al carrito
            // window.location.href = 'cart.html';
        });
    }
});
