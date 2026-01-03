// 1. IMPORTAR FIREBASE
import { db, auth } from './firebase.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES GLOBALES ---
    let currentUser = null;
    const isSpanish = window.location.pathname.includes("/es/");

    // Escuchar el estado del usuario
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            console.log("Usuario detectado:", user.email);
        } else {
            console.log("Usuario no logueado");
        }
    });

    // 2. RECUPERAR DATOS DEL SESSION STORAGE
    const bookingDataJSON = sessionStorage.getItem('checkoutItem');
    let bookingData;

    if (!bookingDataJSON) {
        // Datos de prueba (Fallback)
        bookingData = {
            id: 'tour-test',
            title: 'Tour de Prueba',
            title_es: 'Tour de Prueba (ES)',
            date: '2025-01-01',
            time: '10:00 AM',
            persons: 1,
            total: 10.00,
            image: '../assets/img/placeholder.jpg'
        };
    } else {
        bookingData = JSON.parse(bookingDataJSON);
    }

    // 3. MOSTRAR DATOS EN EL HTML
    const tourNameEl = document.getElementById('tour-name');
    const tourDateTimeEl = document.getElementById('tour-date-time');
    const totalPriceEl = document.getElementById('total-price');
    const tourImageEl = document.getElementById('tour-image');

    const displayTitle = (isSpanish && bookingData.title_es) ? bookingData.title_es : bookingData.title;
    
    if(tourNameEl) tourNameEl.textContent = displayTitle;
    if(tourDateTimeEl) tourDateTimeEl.textContent = `Date: ${bookingData.date} / Time: ${bookingData.time}`;
    if(totalPriceEl) totalPriceEl.textContent = `$${bookingData.total}`;
    
    // 🔥 CORRECCIÓN DE IMAGEN PARA ESPAÑOL
    if (tourImageEl) {
        let imagePath = bookingData.image;
        if (isSpanish && imagePath.startsWith('../')) {
            imagePath = "../" + imagePath;
        }
        tourImageEl.src = imagePath;
        tourImageEl.alt = displayTitle;
    }

    // ============================================
    // 🔥 FUNCIÓN PARA GUARDAR EN FIREBASE
    // ============================================
    async function saveBookingToFirebase(paymentDetails, paymentMethod) {
        try {
            const bookingsRef = collection(db, "bookings");

            const newBooking = {
                userId: currentUser ? currentUser.uid : "guest",
                userEmail: currentUser ? currentUser.email : "guest@example.com",
                tourId: bookingData.id,
                tourName: bookingData.title,
                date: bookingData.date,
                time: bookingData.time,
                persons: bookingData.persons,
                totalPrice: parseFloat(bookingData.total),
                currency: "USD",
                paymentMethod: paymentMethod, 
                paymentId: paymentDetails.id || "N/A",
                status: "paid",
                createdAt: serverTimestamp(),
                lang: isSpanish ? 'es' : 'en'
            };

            console.log("Guardando reserva en Firebase...", newBooking);
            
            const docRef = await addDoc(bookingsRef, newBooking);
            console.log("✅ Reserva guardada con ID: ", docRef.id);
            
            saveAndRedirectToConfirmation(docRef.id);

        } catch (e) {
            console.error("❌ Error al guardar en Firebase: ", e);
            saveAndRedirectToConfirmation("ERROR-SAVING-" + Date.now()); 
        }
    }

    // ============================================
    // PAYPAL INTEGRATION
    // ============================================
    let paypalInitialized = false;

    window.initializePayPal = function() {
        if (paypalInitialized) return;
        const container = document.getElementById('paypal-button-container');
        if (!container) return;

        if (typeof paypal === 'undefined') {
            console.error('PayPal SDK not loaded');
            return;
        }

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
            onError: function(err) {
                console.error('PayPal error:', err);
                alert('Hubo un error con PayPal.');
            }
        }).render('#paypal-button-container');
        
        paypalInitialized = true;
    }

    // ============================================
    // GOOGLE PAY (VIA PAYPAL)
    // ============================================
    let googlePayInitialized = false;

    window.initializeGooglePay = function() {
        if (googlePayInitialized) return;
        const container = document.getElementById('googlepay-button-container');
        if (!container) return;

        if (typeof paypal === 'undefined') { console.error('PayPal SDK no cargó'); return; }

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
                },
                onError: function(err) {
                    console.error('Google Pay error:', err);
                    alert('Error Google Pay.');
                }
            });

            if (gpButton.isEligible()) {
                gpButton.render('#googlepay-button-container');
                googlePayInitialized = true;
            } else {
                container.innerHTML = '<p style="color:red; font-size: 0.9rem">Google Pay no disponible.</p>';
            }
        } catch (error) { console.error("Error GPay:", error); }
    }

    // ============================================
    // 🧡 CULQI INTEGRATION (Nuevo)
    // ============================================
    
    // Esta función se llama cuando Culqi responde (éxito o error)
    // Culqi busca esta función en el objeto 'window' automáticamente
    window.culqi = function() {
        if (Culqi.token) { 
            // ¡Éxito! Token Creado
            const token = Culqi.token.id;
            const email = Culqi.token.email;
            console.log('Culqi Token creado: ' + token);
            
            // Cierra el modal de Culqi
            Culqi.close();

            // 🔥 GUARDAMOS EN FIREBASE
            // Nota: En un sistema real, aquí enviarías el token a tu backend para hacer el cargo.
            // Como estamos solo "conectando", simulamos que el pago pasó y guardamos la reserva.
            const paymentDetails = {
                id: "CULQI-" + token, // Creamos un ID falso basado en el token
                email: email,
                status: "COMPLETED"
            };
            
            saveBookingToFirebase(paymentDetails, 'culqi');

        } else {
            // Error
            console.log(Culqi.error);
            alert(Culqi.error.user_message);
        }
    };

    window.initializeCulqi = function() {
        const btnCulqi = document.getElementById('btn_pagar_culqi');
        if (!btnCulqi) return;

        // Mostrar el botón
        btnCulqi.style.display = 'block';

        if (typeof Culqi === 'undefined') {
            console.error("Culqi JS no cargó");
            return;
        }

        // 1. Configura tu LLAVE PÚBLICA (Reemplaza 'pk_test_...' con la tuya)
        Culqi.publicKey = 'pk_test_nCJhgAPBfjSMOz5d'; 

        // 2. Configuraciones visuales
        Culqi.settings({
            title: 'South Americans Secrets',
            currency: 'USD',  // Culqi soporta USD y PEN
            description: bookingData.title,
            // ¡IMPORTANTE! Culqi usa enteros (centavos). $10.00 = 1000
            amount: Math.round(parseFloat(bookingData.total) * 100) 
        });
        
        // Asignar el click al botón
        btnCulqi.onclick = function(e) {
            e.preventDefault();
            Culqi.open(); // Abre la ventanita de pago
        };
    }

    // ============================================
    // INTERFAZ DE SELECCIÓN (RADIO BUTTONS)
    // ============================================
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
            
            if (method === 'paypal') {
                setTimeout(() => window.initializePayPal(), 100);
            } 
            else if (method === 'googlepay') { 
                setTimeout(() => window.initializeGooglePay(), 100);
            }
            else if (method === 'culqi') { // <--- CAMBIO A CULQI
                setTimeout(() => window.initializeCulqi(), 100);
            }
        };

        label.addEventListener('click', (e) => { e.preventDefault(); activateOption(); });
        if (radio) radio.addEventListener('change', () => { if (radio.checked) activateOption(); });
    });

    // ============================================
    // REDIRECCIÓN FINAL
    // ============================================
    function saveAndRedirectToConfirmation(bookingId) {
        const finalTitle = (isSpanish && bookingData.title_es) ? bookingData.title_es : bookingData.title;

        const finalBookingDetails = {
            ...bookingData,
            title: finalTitle,
            bookingId: bookingId,
            status: 'confirmed'
        };

        sessionStorage.setItem('finalBookingDetails', JSON.stringify(finalBookingDetails));
        sessionStorage.removeItem('checkoutItem');
        
        window.location.href = 'confirmation.html';
    }
});