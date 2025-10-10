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


// Espera a que todo el contenido de la página se cargue
document.addEventListener('DOMContentLoaded', function() {

    // 1. Define el contenido HTML que quieres agregar
    const additionalInfoHTML = `
        <div class="additional-info-section">
            <h2>Additional Information</h2>
            
            <ul>
                <li>All your personal information is required at the moment of your booking.</li>
                <li>Confirmation of the excursion will be received at time of booking.</li>
                <li>All tours are operated in English unless otherwise stated.</li>
            </ul>

            <h3>Travel voucher:</h3>
            <ul>
                <li>You will receive an electronic voucher via e mail once you booking is confirmed.</li>
                <li>For each confirmed booking you are required to print your electronic voucher for presentation at the start of the excursion.</li>
                <li>The electronic voucher acts a confirmation for all services you request.</li>
            </ul>

            <h3>Local operator information:</h3>
            <ul>
                <li>We will send you complete operator information, including phone numbers at your destination.</li>
                <li>Our managers select only the most experienced and reliable operators in each destination, removing the guesswork for you, and ensuring your peace of mind.</li>
            </ul>
        </div>
    `;

    // 2. Busca el último elemento de la sección del tour para colocar la info después
    const bookingSection = document.querySelector('.tour-booking-info');

    // 3. Si encuentra ese elemento, inserta el nuevo contenido HTML justo después
    if (bookingSection) {
        bookingSection.insertAdjacentHTML('afterend', additionalInfoHTML);
    }

});
