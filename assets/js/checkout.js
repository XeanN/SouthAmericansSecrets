// 1. IMPORTAR DESDE TU ARCHIVO LOCAL (Usando Realtime Database)
import { db, auth, ref, push, set, serverTimestamp } from './firebase.js'; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES GLOBALES ---
    let currentUser = null;
    const isSpanish = window.location.pathname.includes("/es/");

    onAuthStateChanged(auth, (user) => {
        if (user) currentUser = user;
    });

    // 2. RECUPERAR DATOS
    const bookingDataJSON = sessionStorage.getItem('checkoutItem');
    let bookingData = bookingDataJSON ? JSON.parse(bookingDataJSON) : null;

    if (!bookingData) {
        // Fallback para pruebas
        bookingData = { id: 'test', title: 'Tour Prueba', date: '2025-01-01', time: '10:00', persons: 1, total: 10.00 };
    }

    // 3. MOSTRAR DATOS EN HTML
    const tourNameEl = document.getElementById('tour-name');
    const tourDateTimeEl = document.getElementById('tour-date-time');
    const totalPriceEl = document.getElementById('total-price');
    const tourImageEl = document.getElementById('tour-image');

    const displayTitle = (isSpanish && bookingData.title_es) ? bookingData.title_es : bookingData.title;
    
    if(tourNameEl) tourNameEl.textContent = displayTitle;
    if(tourDateTimeEl) tourDateTimeEl.textContent = `Date: ${bookingData.date} / Time: ${bookingData.time}`;
    if(totalPriceEl) totalPriceEl.textContent = `$${bookingData.total}`;
    
    if (tourImageEl && bookingData.image) {
        let imagePath = bookingData.image;
        if (isSpanish && imagePath.startsWith('../')) imagePath = "../" + imagePath;
        tourImageEl.src = imagePath;
    }

    // ============================================
    // 🔥 FUNCIÓN QUE "ENGAÑA" AL SISTEMA ANTIGUO
    // ============================================
    async function saveBookingToFirebase(paymentDetails, paymentMethod) {
        try {
            console.log("Guardando en el sistema antiguo...");
            
            // Apuntamos a la misma carpeta 'reservations' de siempre
            const reservationsRef = ref(db, 'reservations');
            const newBookingRef = push(reservationsRef);

            // ⚠️ AQUÍ ESTÁ EL TRUCO: Usamos los nombres exactos del archivo viejo
            const oldFormatData = {
                name: currentUser ? (currentUser.displayName || currentUser.email) : "Invitado Web Nueva",
                email: currentUser ? currentUser.email : "guest@example.com",
                date: bookingData.date + " " + bookingData.time, // Formato antiguo unía fecha y hora
                tour_id: bookingData.id,      // Antes era 'tour_id'
                tour_title: bookingData.title, // Antes era 'tour_title'
                nPeople: bookingData.persons, // Antes era 'nPeople'
                lang: isSpanish ? 'es' : 'en',
                payment_type: paymentMethod,  // Antes era 'payment_type'
                notes: `Pago verificado: ${paymentDetails.id}. Total: $${bookingData.total}`, // Guardamos detalles de pago en notas
                timestamp: serverTimestamp()
            };

            // Guardamos los datos
            await set(newBookingRef, oldFormatData);
            
            console.log("✅ Datos enviados al sistema de tu amigo.");
            
            // Si el sistema antiguo funciona, el correo saldrá solo ahora.
            saveAndRedirectToConfirmation(newBookingRef.key);

        } catch (e) {
            console.error("Error guardando:", e);
            alert("Error de conexión con la base de datos.");
            saveAndRedirectToConfirmation("ERROR-DB"); 
        }
    }

    // ============================================
    // INTEGRACIONES DE PAGO (SIN CAMBIOS)
    // ============================================
    
    // PAYPAL
    let paypalInitialized = false;
    window.initializePayPal = function() {
        if (paypalInitialized) return;
        const container = document.getElementById('paypal-button-container');
        if (!container) return;
        if (typeof paypal === 'undefined') return;

        paypal.Buttons({
            style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        description: bookingData.title,
                        amount: { currency_code: 'USD', value: bookingData.total },
                        custom_id: bookingData.id
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    saveBookingToFirebase(details, 'paypal'); 
                });
            },
            onError: function(err) { alert('Error PayPal'); }
        }).render('#paypal-button-container');
        paypalInitialized = true;
    }

    // GOOGLE PAY
    let googlePayInitialized = false;
    window.initializeGooglePay = function() {
        if (googlePayInitialized) return;
        const container = document.getElementById('googlepay-button-container');
        if (!container) return;
        if (typeof paypal === 'undefined') return;

        try {
            const gpButton = paypal.Buttons({
                fundingSource: paypal.FUNDING.GOOGLEPAY,
                style: { layout: 'horizontal', label: 'pay', height: 45 },
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            description: bookingData.title,
                            amount: { currency_code: 'USD', value: bookingData.total },
                            custom_id: bookingData.id
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        saveBookingToFirebase(details, 'googlepay'); 
                    });
                }
            });
            if (gpButton.isEligible()) {
                gpButton.render('#googlepay-button-container');
                googlePayInitialized = true;
            } else { container.innerHTML = '<p style="color:red; font-size: 0.9rem">GPay no disponible.</p>'; }
        } catch (error) { console.error(error); }
    }

    // CULQI
    window.culqi = function() {
        if (Culqi.token) { 
            const token = Culqi.token.id;
            const email = Culqi.token.email;
            Culqi.close();
            const paymentDetails = { id: "CULQI-" + token, email: email, status: "COMPLETED" };
            saveBookingToFirebase(paymentDetails, 'culqi');
        } else {
            console.log(Culqi.error);
            alert(Culqi.error.user_message);
        }
    };
    window.initializeCulqi = function() {
        const btnCulqi = document.getElementById('btn_pagar_culqi');
        if (!btnCulqi) return;
        btnCulqi.style.display = 'block';
        
        Culqi.publicKey = 'pk_test_nCJhgAPBfjSMOz5d'; 
        
        Culqi.settings({
            title: 'South Americans Secrets',
            currency: 'USD',
            description: bookingData.title,
            amount: Math.round(parseFloat(bookingData.total) * 100) 
        });
        btnCulqi.onclick = function(e) { e.preventDefault(); Culqi.open(); };
    }

    // SELECTOR DE PAGO
    document.querySelectorAll(".payment-option").forEach(option => {
        const label = option.querySelector('label');
        const radio = option.querySelector('input[type="radio"]');
        const activateOption = () => {
            document.querySelectorAll(".payment-option").forEach(o => {
                o.classList.remove("active");
                const r = o.querySelector('input[type="radio"]');
                if (r) r.checked = false;
            });
            option.classList.add("active");
            if (radio) radio.checked = true;
            
            const method = option.dataset.method;
            if (method === 'paypal') setTimeout(() => window.initializePayPal(), 100);
            else if (method === 'googlepay') setTimeout(() => window.initializeGooglePay(), 100);
            else if (method === 'culqi') setTimeout(() => window.initializeCulqi(), 100);
        };
        label.addEventListener('click', (e) => { e.preventDefault(); activateOption(); });
        if (radio) radio.addEventListener('change', () => { if (radio.checked) activateOption(); });
    });

    function saveAndRedirectToConfirmation(bookingId) {
        const finalTitle = (isSpanish && bookingData.title_es) ? bookingData.title_es : bookingData.title;
        const finalBookingDetails = { ...bookingData, title: finalTitle, bookingId: bookingId, status: 'confirmed' };
        sessionStorage.setItem('finalBookingDetails', JSON.stringify(finalBookingDetails));
        sessionStorage.removeItem('checkoutItem');
        window.location.href = 'confirmation.html';
    }
});