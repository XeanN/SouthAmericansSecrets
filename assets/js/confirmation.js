// --- COPIA Y REEMPLAZA TODO TU ARCHIVO confirmation.js CON ESTO ---

// 1. IMPORTACIONES (Añadimos las de Firebase)
import { auth, db } from "../assets/js/firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// 2. CÓDIGO PARA RELLENAR LA PÁGINA (El que tú tenías)
document.addEventListener('DOMContentLoaded', () => {

    // Leemos la "memoria"
    const bookingDataJSON = sessionStorage.getItem('finalBookingDetails'); 

    // Si no hay datos, mostramos un error
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

    // Si hay datos, los preparamos
    const bookingData = JSON.parse(bookingDataJSON);

    // Seleccionar elementos del DOM
    const bookingIdEl = document.getElementById('booking-id');
    const tourTitleEl = document.getElementById('tour-title');
    const tourDateTimeEl = document.getElementById('tour-date-time');
    const tourImageConfirmationEl = document.getElementById('tour-image-confirmation');

    // Rellenar la página con los datos
    // Generamos el ID aleatorio
    const randomBookingId = `#${Math.floor(100000 + Math.random() * 900000)}`; 
    if (bookingIdEl) bookingIdEl.textContent = randomBookingId;
    
    // Rellenamos el resto
    if (tourTitleEl) tourTitleEl.textContent = bookingData.title;
    if (tourDateTimeEl) tourDateTimeEl.textContent = `${bookingData.date} / ${bookingData.time}`;
    if (tourImageConfirmationEl) {
        tourImageConfirmationEl.src = bookingData.image; 
        tourImageConfirmationEl.alt = bookingData.title;
    }

    // ----------------------------------------------------
    // 3. ¡NUEVO! LÓGICA PARA GUARDAR EN FIREBASE
    // ----------------------------------------------------

    // Verificamos que el usuario esté logueado
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // El usuario SÍ está logueado. Buscamos el botón.
            
            // ⛔️ ¡IMPORTANTE! ⛔️
            // Cambia 'boton-finalizar-dashboard' por el ID de tu botón
            // en la página confirmation.html
            const finalConfirmButton = document.getElementById('boton-finalizar-dashboard'); 

            if (finalConfirmButton) {
                finalConfirmButton.addEventListener('click', (e) => {
                    e.preventDefault();

                    // Preparamos los datos finales para guardar
                    bookingData.bookingId = randomBookingId; // Guardamos el ID que generamos
                    bookingData.status = "CONFIRMED";

                    // Creamos la ruta en la base de datos
                    const userBookingsRef = ref(db, 'users/' + user.uid + '/bookings');

                    // ¡Guardamos la reserva!
                    push(userBookingsRef, bookingData)
                        .then(() => {
                            console.log("¡Reserva guardada en Firebase!");
                            // Limpiamos la "memoria"
                            sessionStorage.removeItem('finalBookingDetails'); 
                            
                            // Avisamos y redirigimos
                            alert("¡Tu reserva ha sido confirmada!");
                            window.location.href = '../pages/dashboard.html';
                        })
                        .catch((error) => {
                            console.error("Error al guardar en Firebase: ", error);
                            alert("Hubo un error al confirmar tu reserva.");
                        });
                });
            } else {
                console.error("ERROR: No se encontró el botón de confirmación final.");
            }

        } else {
            // No hay usuario logueado. No debería poder confirmar.
            console.warn("Usuario no logueado en página de confirmación.");
            // Opcional: Ocultar el botón si no hay usuario
            const finalConfirmButton = document.getElementById('boton-finalizar-dashboard');
            if (finalConfirmButton) finalConfirmButton.style.display = 'none';
        }
    });
});