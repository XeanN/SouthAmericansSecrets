document.addEventListener('DOMContentLoaded', () => {
    // --- 1. LEER EL TOUR ID DE LA URL ---
    const params = new URLSearchParams(window.location.search);
    const tourId = params.get('tour'); // Esto será "lima-city-tour", "nazca-lines-flight", etc.

    // --- 2. BUSCAR LOS DATOS DEL TOUR ---
    // Usamos el tourId para encontrar el objeto correcto en nuestra "base de datos"
    const currentTour = toursData[tourId];

    // --- MANEJO DE ERROR: ¿Qué pasa si el tour no existe? ---
    if (!currentTour) {
        document.querySelector('.booking-page').innerHTML = `
            <h1 style="color: red; text-align: center;">Error: Tour no encontrado</h1>
            <p style="text-align: center;">Por favor, regresa a la lista de tours y selecciona uno válido.</p>
        `;
        return; // Detiene la ejecución del script si no se encuentra el tour
    }

    // --- 3. ESTADO DINÁMICO DE LA RESERVA ---
    const bookingState = {
        date: 'June 07, 2025', // Puedes hacer el calendario más dinámico si quieres
        time: '08:00 AM',
        // El estado inicial se toma de los datos del tour actual
        persons: currentTour.minPersons,
        pricePerPerson: currentTour.price
    };

    // --- 4. SELECCIÓN DE ELEMENTOS DEL DOM ---
    // (Estos son los elementos que vamos a rellenar con datos)
    const pageTitle = document.querySelector('title');
    const tourTitleElement = document.querySelector('.tour-title');
    const tourDurationElement = document.querySelector('.duration');
    const tourRatingElement = document.querySelector('.rating');
    const heroImageElement = document.querySelector('.hero-image');
    
    const summaryDate = document.querySelector('.summary-item .summary-value');
    const summaryTime = document.querySelectorAll('.summary-item .summary-value')[1];
    const summaryPersons = document.querySelector('.num-persons');
    const summaryTotal = document.querySelector('.total-value');
    
    const dayElements = document.querySelectorAll('.calendar .day.available');
    const timeButtons = document.querySelectorAll('.time-btn');
    const increasePersonBtn = document.querySelector('.increase-person');
    const decreasePersonBtn = document.querySelector('.decrease-person');

    // --- 5. FUNCIONES ---

    /**
     * Rellena la página con la información del tour cargado.
     */
    function populatePage() {
        pageTitle.textContent = `${currentTour.title} - Booking`;
        tourTitleElement.textContent = currentTour.title;
        tourDurationElement.innerHTML = `<span>&#9200;</span> ${currentTour.duration}`;
        tourRatingElement.innerHTML = `<span>&#9733;</span> ${currentTour.rating}`;
        heroImageElement.style.backgroundImage = `url('${currentTour.image}')`;
    }
    
    /**
     * Actualiza la tarjeta de resumen de la reserva.
     */
    function updateSummary() {
        const formattedTime = bookingState.time.replace(' ', '').toLowerCase();
        
        summaryDate.textContent = bookingState.date;
        summaryTime.textContent = formattedTime;
        summaryPersons.textContent = bookingState.persons;

        const total = bookingState.persons * bookingState.pricePerPerson;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
    }

    // --- 6. EVENT LISTENERS ---

    // ... (Los listeners para calendario y hora no cambian)
    dayElements.forEach(day => {
        day.addEventListener('click', () => {
            dayElements.forEach(d => d.classList.remove('selected'));
            day.classList.add('selected');
            const dayNumber = day.textContent;
            bookingState.date = `June ${dayNumber}, 2025`; // Mes y año aún estáticos
            updateSummary();
        });
    });

    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            bookingState.time = button.textContent;
            updateSummary();
        });
    });
    
    // El botón de aumentar personas funciona igual
    increasePersonBtn.addEventListener('click', () => {
        bookingState.persons++;
        updateSummary();
    });
    
    // El botón de disminuir AHORA respeta el mínimo de personas del tour
    decreasePersonBtn.addEventListener('click', () => {
        if (bookingState.persons > currentTour.minPersons) {
            bookingState.persons--;
            updateSummary();
        }
    });

    // --- 7. INICIALIZACIÓN ---
    populatePage();    // Rellena la página con los datos del tour
    updateSummary();   // Calcula y muestra el resumen inicial

    // ... (Todo tu código anterior que llena la página está aquí arriba)
    // ... (La última función era la inicialización)
    populatePage();    
    updateSummary();

    // --- NUEVA LÓGICA PARA EL BOTÓN "CONTINUE" ---
    const continueButton = document.querySelector('.btn-continue');

    continueButton.addEventListener('click', (event) => {
        event.preventDefault(); // Buena práctica para evitar recargas inesperadas

        // 1. Recupera el carrito existente de sessionStorage (o crea una lista vacía)
        const cartData = sessionStorage.getItem('cartItems');
        let cart = cartData ? JSON.parse(cartData) : [];

        // 2. Crea el objeto final de la reserva.
        // Combina los datos estáticos del tour (currentTour) con las selecciones del usuario (bookingState)
        const bookingDetails = {
            id: tourId + '-' + new Date().getTime(), // ID único para poder quitarlo del carrito después
            title: currentTour.title,
            image: currentTour.image,
            price: currentTour.price,
            date: bookingState.date,
            time: bookingState.time,
            persons: bookingState.persons
        };

        // 3. Agrega la nueva reserva a la lista.
        cart.push(bookingDetails);

        // 4. Guarda la lista actualizada de vuelta en sessionStorage.
        sessionStorage.setItem('cartItems', JSON.stringify(cart));

        // 5. Redirige al usuario a la página del carrito.
        // Asegúrate de que la ruta sea la correcta para tu proyecto.
        window.location.href = 'cart.html'; // Ajusta la ruta si es necesario
    });

}); // Esta es la llave de cierre final de tu script