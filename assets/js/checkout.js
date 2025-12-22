// 1. IMPORTAR FIREBASE
// Asegúrate de que firebase.js exporte 'db' y 'auth' correctamente
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

    // Usar título en español si corresponde
    const displayTitle = (isSpanish && bookingData.title_es) ? bookingData.title_es : bookingData.title;
    
    if(tourNameEl) tourNameEl.textContent = displayTitle;
    if(tourDateTimeEl) tourDateTimeEl.textContent = `Date: ${bookingData.date} / Time: ${bookingData.time}`;
    if(totalPriceEl) totalPriceEl.textContent = `$${bookingData.total}`;
    
    // 🔥 CORRECCIÓN DE IMAGEN PARA ESPAÑOL
    if (tourImageEl) {
        let imagePath = bookingData.image;
        
        // Si estamos en la carpeta 'es' (profundidad extra), ajustamos la ruta visualmente
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
            // Referencia a la colección "bookings"
            const bookingsRef = collection(db, "bookings");

            // Datos a guardar
            const newBooking = {
                userId: currentUser ? currentUser.uid : "guest",
                userEmail: currentUser ? currentUser.email : "guest@example.com",
                tourId: bookingData.id,
                tourName: bookingData.title, // Guardamos nombre en inglés por estandarización (o displayTitle si prefieres)
                date: bookingData.date,
                time: bookingData.time,
                persons: bookingData.persons,
                totalPrice: parseFloat(bookingData.total),
                currency: "USD",
                paymentMethod: paymentMethod, // 'paypal' o 'mercadopago'
                paymentId: paymentDetails.id || "N/A",
                status: "paid",
                createdAt: serverTimestamp(),
                lang: isSpanish ? 'es' : 'en' // Guardamos el idioma de compra
            };

            console.log("Guardando reserva en Firebase...", newBooking);
            
            const docRef = await addDoc(bookingsRef, newBooking);
            console.log("✅ Reserva guardada con ID: ", docRef.id);
            
            // Una vez guardado, redirigir
            saveAndRedirectToConfirmation(docRef.id);

        } catch (e) {
            console.error("❌ Error al guardar en Firebase: ", e);
            // Aun si falla el guardado, redirigimos porque el pago ya se hizo
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
            // container.innerHTML = "Error loading PayPal"; // Opcional
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
                    console.log('Pago PayPal exitoso:', details);
                    // Guardar en Firebase
                    saveBookingToFirebase(details, 'paypal'); 
                });
            },

            onError: function(err) {
                console.error('PayPal error:', err);
                alert('Hubo un error procesando el pago con PayPal.');
            }
        }).render('#paypal-button-container');
        
        paypalInitialized = true;
    }

    // ============================================
    // MERCADO PAGO INTEGRATION
    // ============================================
    let mpInitialized = false;

    window.initializeMercadoPago = function() {
        if (mpInitialized) return;
        
        const container = document.getElementById('paymentBrick_container');
        if (!container) return;

        if (typeof MercadoPago === 'undefined') return;

        const mp = new MercadoPago('APP_USR-c9cebee3-1bdc-49ef-a2ba-8e333ba574dd', { locale: 'es-PE' });
        const bricksBuilder = mp.bricks();

        bricksBuilder.create('payment', 'paymentBrick_container', {
            initialization: {
                amount: parseFloat(bookingData.total),
            },
            customization: {
                paymentMethods: { maxInstallments: 1 }
            },
            callbacks: {
                onReady: () => mpInitialized = true,
                onSubmit: ({ selectedPaymentMethod, formData }) => {
                    return new Promise((resolve, reject) => {
                        console.log("Procesando Mercado Pago...", formData);
                        
                        // Simulamos éxito (Falta Backend Real)
                        setTimeout(() => {
                            const simulatedDetails = { id: "MP-" + Date.now() }; 
                            saveBookingToFirebase(simulatedDetails, 'mercadopago');
                            resolve();
                        }, 2000);
                    });
                },
                onError: (error) => console.error(error),
            },
        });
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
            if (method === 'paypal') setTimeout(() => window.initializePayPal(), 100);
            else if (method === 'card') setTimeout(() => window.initializeMercadoPago(), 100);
        };

        label.addEventListener('click', (e) => { e.preventDefault(); activateOption(); });
        if (radio) radio.addEventListener('change', () => { if (radio.checked) activateOption(); });
    });

    // ============================================
    // REDIRECCIÓN FINAL
    // ============================================
    function saveAndRedirectToConfirmation(bookingId) {
        const finalTitle = (isSpanish && bookingData.title_es) ? bookingData.title_es : bookingData.title;

        // Preparamos los datos para la página de "Gracias"
        const finalBookingDetails = {
            ...bookingData,
            title: finalTitle, // Título ya traducido
            bookingId: bookingId, // ID real de Firebase
            status: 'confirmed'
        };

        sessionStorage.setItem('finalBookingDetails', JSON.stringify(finalBookingDetails));
        sessionStorage.removeItem('checkoutItem'); // Limpiamos el carrito
        
        window.location.href = 'confirmation.html';
    }
});