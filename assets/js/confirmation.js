// 1. IMPORTACIONES CORRECTAS (Usando Firestore)
import { auth } from "./firebase.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {

    // --- A. RECUPERAR DATOS ---
    // Leemos la información que guardó checkout.js
    const bookingDataJSON = sessionStorage.getItem('finalBookingDetails'); 

    // Si no hay datos (el usuario intentó entrar directo sin comprar)
    if (!bookingDataJSON) {
        document.querySelector('.confirmation-page').innerHTML = `
            <div style="text-align:center; padding: 50px;">
                <h1>⚠️ Error: No hay datos de reserva.</h1>
                <p>Por favor realiza una compra primero.</p>
                <a href="../index.html" style="color:#0d1e4c; font-weight:bold;">Volver al Inicio</a>
            </div>
        `;
        return;
    }

    // Convertimos el texto a objeto
    const bookingData = JSON.parse(bookingDataJSON);

    // --- B. SELECCIONAR ELEMENTOS DEL HTML ---
    const bookingIdEl = document.getElementById('booking-id');
    const tourTitleEl = document.getElementById('tour-title');
    const tourDateTimeEl = document.getElementById('tour-date-time');
    const tourImageConfirmationEl = document.getElementById('tour-image-confirmation');
    const btnFinalizar = document.getElementById('boton-finalizar-dashboard');

    // --- C. RELLENAR LA PÁGINA (Soporte Español/Inglés) ---
    
    // 1. ID DE RESERVA: Usamos el ID REAL de Firebase (o uno corto si no existe)
    // Si bookingId existe (viene de checkout), usamos ese. Si no, fallback.
    const displayId = bookingData.bookingId ? `#${bookingData.bookingId.slice(0, 8).toUpperCase()}` : "#PENDING";
    
    if (bookingIdEl) bookingIdEl.textContent = displayId;
    
    // 2. TÍTULO Y DATOS:
    // El título YA viene traducido desde checkout.js, así que solo lo mostramos.
    if (tourTitleEl) tourTitleEl.textContent = bookingData.title;
    
    // 3. FECHA Y HORA:
    if (tourDateTimeEl) tourDateTimeEl.textContent = `${bookingData.date} / ${bookingData.time}`;
    
    // 4. IMAGEN:
    if (tourImageConfirmationEl) {
        tourImageConfirmationEl.src = bookingData.image; 
        tourImageConfirmationEl.alt = bookingData.title;
    }

    // --- D. LÓGICA DEL BOTÓN FINALIZAR ---
    
    // Verificamos si el usuario está logueado solo para personalizar la experiencia
    onAuthStateChanged(auth, (user) => {
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', (e) => {
                e.preventDefault();

                // Limpiamos la memoria de la compra para que no aparezca de nuevo al recargar
                sessionStorage.removeItem('finalBookingDetails'); 

                if (user) {
                    // Si está logueado, va a su Dashboard
                    window.location.href = '../pages/dashboard.html';
                } else {
                    // Si compró como invitado, va al inicio
                    window.location.href = '../index.html';
                }
            });
        }
    });
});