document.addEventListener('DOMContentLoaded', () => {
    // 1. Recuperar los datos del sessionStorage
    const bookingDataJSON = sessionStorage.getItem('checkoutItem');

    // 2. Si no hay datos, mostrar un error
    if (!bookingDataJSON) {
        document.querySelector('.checkout-page').innerHTML = `
            <div style="text-align:center;">
                <h1>Error: No booking data found.</h1>
                <p>Please select a tour and date first.</p>
                <a href="tours.html" style="color:#0d1e4c;">Go back to tours</a>
            </div>
        `;
        return;
    }

    // 3. Convertir los datos de JSON a un objeto JavaScript
    const bookingData = JSON.parse(bookingDataJSON);

    // 4. Seleccionar los elementos del HTML
    const tourNameEl = document.getElementById('tour-name');
    const tourDateTimeEl = document.getElementById('tour-date-time');
    const totalPriceEl = document.getElementById('total-price');
    const tourImageEl = document.getElementById('tour-image');
    const paymentForm = document.getElementById('payment-form');

    // 5. Rellenar la página con los datos
    tourNameEl.textContent = bookingData.title;
    tourDateTimeEl.textContent = `Date: ${bookingData.date} / Time: ${bookingData.time}`;
    totalPriceEl.textContent = `$${bookingData.total}`;
    tourImageEl.src = bookingData.image;
    tourImageEl.alt = bookingData.title;
    
    // 6. Añadir funcionalidad al botón de "Confirmar y Pagar"
    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue

        // Creamos el objeto final con los detalles de la reserva para la página de confirmación
        const finalBookingDetails = {
            id: bookingData.id,
            title: bookingData.title,
            image: bookingData.image,
            date: bookingData.date,
            time: bookingData.time,
            persons: bookingData.persons,
            total: bookingData.total
        };

        // Guardamos este objeto en sessionStorage con una NUEVA CLAVE
        sessionStorage.setItem('finalBookingDetails', JSON.stringify(finalBookingDetails));

        // Limpiar el 'checkoutItem' que ya no se necesita
        sessionStorage.removeItem('checkoutItem');

        // Redirigir a la página de confirmación
        window.location.href = 'confirmation.html';
    });
});

// Toggle animación seleccionar método
document.querySelectorAll(".payment-option").forEach(option => {
    option.addEventListener("click", () => {
        document.querySelectorAll(".payment-option").forEach(o => o.classList.remove("active"));
        option.classList.add("active");
        option.querySelector("input").checked = true;
    });
});