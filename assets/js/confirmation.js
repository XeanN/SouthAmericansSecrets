document.addEventListener('DOMContentLoaded', () => {
    const bookingDataJSON = sessionStorage.getItem('finalBookingDetails'); // ¡Importante! Usaremos esta clave

    if (!bookingDataJSON) {
        document.querySelector('.confirmation-page').innerHTML = `
            <div style="text-align:center; padding: 50px;">
                <h1>Error: No booking data found.</h1>
                <p>Please complete a purchase first.</p>
                <a href="../index.html" style="color:#0d1e4c;">Go to Home</a>
            </div>
        `;
        return;
    }

    const bookingData = JSON.parse(bookingDataJSON);

    // Seleccionar elementos del DOM
    const bookingIdEl = document.getElementById('booking-id');
    const tourTitleEl = document.getElementById('tour-title');
    const tourDateTimeEl = document.getElementById('tour-date-time');
    const tourImageConfirmationEl = document.getElementById('tour-image-confirmation');

    // Rellenar la página con los datos
    // Generamos un ID de booking aleatorio simple. Para producción, necesitarías un sistema real.
    bookingIdEl.textContent = `#${Math.floor(100000 + Math.random() * 900000)}`; 
    tourTitleEl.textContent = bookingData.title;
    tourDateTimeEl.textContent = `${bookingData.date} / ${bookingData.time}`;
    tourImageConfirmationEl.src = bookingData.image; // Usamos la ruta de la imagen
    tourImageConfirmationEl.alt = bookingData.title;

    
    // Opcional: Limpiar los datos después de mostrarlos para una sola visualización
    // sessionStorage.removeItem('finalBookingDetails'); 
});