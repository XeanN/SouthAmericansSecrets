import { auth } from "../js/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { toursData } from "./toursData.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. DETECTAR IDIOMA ACTUAL ---
    const isSpanish = window.location.pathname.includes("/es/");
    
    // =======================================================
    // PREGUNTAS FRECUENTES (TRADUCIBLES)
    // =======================================================
    const FAQS_DATA = {
        en: [
            { question: "What is the cancellation policy?", answer: "You can cancel up to 24 hours in advance for a full refund on most of our tours and activities." },
            { question: "Do I need to bring my passport?", answer: "Yes, a current valid passport or a government-issued ID is required on the day of travel." },
            { question: "What payment methods do you accept?", answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal." },
            { question: "Is hotel pickup included?", answer: "Hotel pickup is included from central districts like Miraflores, San Isidro, and Barranco." }
        ],
        es: [
            { question: "¿Cuál es la política de cancelación?", answer: "Puedes cancelar hasta 24 horas antes para obtener un reembolso completo en la mayoría de nuestros tours." },
            { question: "¿Necesito llevar mi pasaporte?", answer: "Sí, se requiere un pasaporte válido o una identificación oficial el día del viaje." },
            { question: "¿Qué métodos de pago aceptan?", answer: "Aceptamos todas las tarjetas de crédito principales (Visa, Mastercard, Amex) y PayPal." },
            { question: "¿Incluye recogida en el hotel?", answer: "La recogida está incluida en distritos céntricos como Miraflores, San Isidro y Barranco." }
        ]
    };

    const GLOBAL_FAQS = isSpanish ? FAQS_DATA.es : FAQS_DATA.en;

    // --- 1. LEER EL TOUR ID DE LA URL ---
    const params = new URLSearchParams(window.location.search);
    const tourId = params.get('tour'); 
    
    if (typeof toursData === 'undefined') {
        console.error('❌ toursData no está cargado');
        const errorMsg = isSpanish ? "Error: Datos de tours no cargados" : "Error: Tours data not loaded";
        document.querySelector('.booking-page').innerHTML = `<h1 style="color: red; text-align: center;">${errorMsg}</h1>`;
        return;
    }

    // --- 2. BUSCAR LOS DATOS DEL TOUR ---
    const currentTour = toursData[tourId];

    if (!currentTour) {
        const errorMsg = isSpanish ? "Error: Tour no encontrado" : "Error: Tour not found";
        const backMsg = isSpanish ? "Por favor regresa a la lista de tours y selecciona uno válido." : "Please return to the tours list and select a valid one.";
        document.querySelector('.booking-page').innerHTML = `
            <h1 style="color: red; text-align: center;">${errorMsg}</h1>
            <p style="text-align: center;">${backMsg}</p>
        `;
        return;
    }

    // --- 3. ESTADO DE LA RESERVA ---
    const bookingState = {
        date: null,
        time: '08:00 AM',
        persons: currentTour.minPersons,
        pricePerPerson: currentTour.price
    };

    // --- 4. SELECCIÓN DE ELEMENTOS DEL DOM ---
    const pageTitle = document.querySelector('title');
    const tourTitleElement = document.querySelector('.tour-title');
    const tourDurationElement = document.querySelector('.duration');
    const tourRatingElement = document.querySelector('.rating');
    const heroImageElement = document.querySelector('.hero-image');
    const summaryDate = document.querySelector('.summary-item .summary-value'); 
    const summaryTime = document.querySelectorAll('.summary-item .summary-value')[1]; 
    const summaryPersons = document.querySelector('.num-persons');
    const summaryTotal = document.querySelector('.total-value');
    const timeButtons = document.querySelectorAll('.time-btn');
    const increasePersonBtn = document.querySelector('.increase-person');
    const decreasePersonBtn = document.querySelector('.decrease-person');
    const continueButton = document.querySelector('.btn-continue');
    const calendarMonthEl = document.getElementById('calendar-month');
    const calendarYearEl = document.getElementById('calendar-year');
    const calendarDaysEl = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const faqContainer = document.getElementById('faq-container');

    // --- 5. LÓGICA DEL CALENDARIO ---
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthNamesEs = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const monthNames = isSpanish ? monthNamesEs : monthNamesEn;

    function renderCalendar(month, year) {
        calendarDaysEl.innerHTML = '';
        calendarMonthEl.textContent = monthNames[month];
        calendarYearEl.textContent = year;
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
        for (let i = 0; i < dayOffset; i++) {
            calendarDaysEl.innerHTML += `<span class="empty"></span>`;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);
            let classes = 'day';
            if (dayDate < today) {
                classes += ' disabled';
            } else {
                classes += ' available';
            }
            calendarDaysEl.innerHTML += `<span class="${classes}">${String(i).padStart(2, '0')}</span>`;
        }
        attachDayClickListeners();
    }

    function attachDayClickListeners() {
        const dayElements = document.querySelectorAll('.calendar .day.available');
        dayElements.forEach(day => {
            day.addEventListener('click', () => {
                document.querySelectorAll('.calendar .day.selected').forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                const dayNumber = day.textContent;
                bookingState.date = `${monthNames[currentMonth]} ${dayNumber}, ${currentYear}`;
                updateSummary();
            });
        });
    }

    // --- 6. FUNCIONES PRINCIPALES ---
    function populatePage() {
        const bookingText = isSpanish ? "Reserva" : "Booking";
        
        // Traducir textos
        const displayTitle = (isSpanish && currentTour.title_es) ? currentTour.title_es : currentTour.title;
        const displayDuration = (isSpanish && currentTour.duration_es) ? currentTour.duration_es : currentTour.duration;
        const displayRating = (isSpanish && currentTour.rating_es) ? currentTour.rating_es : currentTour.rating;

        // Insertar en HTML
        pageTitle.textContent = `${displayTitle} - ${bookingText}`;
        tourTitleElement.textContent = displayTitle; 
        
        tourDurationElement.innerHTML = `<span>&#9200;</span> ${displayDuration}`;
        tourRatingElement.innerHTML = `<span>&#9733;</span> ${displayRating}`;
        
        // 🔥 CORRECCIÓN DE IMAGEN PARA ESPAÑOL
        let imagePath = currentTour.image;
        if (isSpanish && imagePath.startsWith('../')) {
            imagePath = "../" + imagePath; // Se convierte en ../../assets/...
        }
        heroImageElement.style.backgroundImage = `url('${imagePath}')`;
        
        if(isSpanish) continueButton.textContent = "Continuar";
        
        const summaryTitle = document.querySelector('.reservation-summary-card .tour-title');
        if (summaryTitle) summaryTitle.textContent = displayTitle;
    }

    function populateFaqs() {
        if (GLOBAL_FAQS && GLOBAL_FAQS.length > 0) {
            faqContainer.innerHTML = '';
            GLOBAL_FAQS.forEach(faq => {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';
                faqItem.innerHTML = `
                    <button class="faq-question">${faq.question}</button>
                    <div class="faq-answer"><p>${faq.answer}</p></div>
                `;
                faqContainer.appendChild(faqItem);
            });
        }
    }

    function updateSummary() {
        const defaultDateText = isSpanish ? 'Selecciona fecha' : 'Select a date';
        summaryDate.textContent = bookingState.date ? bookingState.date : defaultDateText;
        summaryTime.textContent = bookingState.time.replace(' ', '').toLowerCase();
        summaryPersons.textContent = bookingState.persons;
        const total = bookingState.persons * bookingState.pricePerPerson;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
    }

    // --- 7. EVENT LISTENERS ---
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar(currentMonth, currentYear);
    });

    prevMonthBtn.addEventListener('click', () => {
        const today = new Date();
        if (currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth > today.getMonth())) {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar(currentMonth, currentYear);
        }
    });

    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            bookingState.time = button.textContent;
            updateSummary();
        });
    });

    increasePersonBtn.addEventListener('click', () => {
        bookingState.persons++;
        updateSummary();
    });

    decreasePersonBtn.addEventListener('click', () => {
        if (bookingState.persons > currentTour.minPersons) {
            bookingState.persons--;
            updateSummary();
        }
    });

    faqContainer.addEventListener('click', (event) => {
        const question = event.target.closest('.faq-question');
        if (!question) return;
        const faqItem = question.parentElement;
        const openItems = faqContainer.querySelectorAll('.faq-item.active');
        openItems.forEach(item => {
            if (item !== faqItem) item.classList.remove('active');
        });
        faqItem.classList.toggle('active');
    });

    // --- LOGICA DE CONTINUAR ---
    continueButton.addEventListener('click', (event) => {
        event.preventDefault();
        
        const alertDate = isSpanish ? 'Por favor selecciona una fecha.' : 'Please select a date before continuing.';
        if (!bookingState.date) {
            alert(alertDate);
            return;
        }

        onAuthStateChanged(auth, (user) => {
            if (!user) {
                const alertLogin = isSpanish ? "Necesitas iniciar sesión para reservar." : "You need to login to continue with the booking.";
                alert(alertLogin);
                
                // Redirección corregida al Login
                if(isSpanish) {
                    window.location.href = "../pages/login.html";
                } else {
                    window.location.href = "../pages/login.html";
                }
                return;
            }

            const total = bookingState.persons * bookingState.pricePerPerson;

            // Título para guardar (usamos el traducido o el original)
            const finalTitle = (isSpanish && currentTour.title_es) ? currentTour.title_es : currentTour.title;

            const bookingDetails = {
                id: tourId,
                title: currentTour.title, // Guardamos ID original por consistencia
                title_es: currentTour.title_es, // Guardamos también la traducción por si acaso
                image: currentTour.image, // Guardamos ruta original
                date: bookingState.date,
                time: bookingState.time,
                persons: bookingState.persons,
                total: total.toFixed(2),
                userId: user.uid,
                lang: isSpanish ? 'es' : 'en'
            };

            sessionStorage.setItem('checkoutItem', JSON.stringify(bookingDetails));
            window.location.href = 'checkout.html'; 
        });
    });

    // --- 8. INICIALIZACIÓN ---
    populatePage();
    populateFaqs();
    updateSummary();
    renderCalendar(currentMonth, currentYear);
});