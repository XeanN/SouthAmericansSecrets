document.addEventListener('DOMContentLoaded', () => {
    // =======================================================
    // PREGUNTAS FRECUENTES GLOBALES
    // =======================================================
    // Aquí defines las preguntas que serán iguales para TODOS los tours.
    const GLOBAL_FAQS = [
        {
            question: "What is the cancellation policy?",
            answer: "You can cancel up to 24 hours in advance for a full refund on most of our tours and activities."
        },
        {
            question: "Do I need to bring my passport?",
            answer: "Yes, a current valid passport or a government-issued ID is required on the day of travel."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal."
        },
        {
            question: "Is hotel pickup included?",
            answer: "Hotel pickup is included from central districts like Miraflores, San Isidro, and Barranco. Please check the tour details for specific information."
        }
    ];

    // --- 1. LEER EL TOUR ID DE LA URL ---
    const params = new URLSearchParams(window.location.search);
    const tourId = params.get('tour'); 

    // --- 2. BUSCAR LOS DATOS DEL TOUR ---
    const currentTour = toursData[tourId];

    // --- MANEJO DE ERROR ---
    if (!currentTour) {
        document.querySelector('.booking-page').innerHTML = `
            <h1 style="color: red; text-align: center;">Error: Tour not found</h1>
            <p style="text-align: center;">Please return to the tours list and select a valid one.</p>
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
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
        pageTitle.textContent = `${currentTour.title} - Booking`;
        tourTitleElement.textContent = currentTour.title;
        tourDurationElement.innerHTML = `<span>&#9200;</span> ${currentTour.duration}`;
        tourRatingElement.innerHTML = `<span>&#9733;</span> ${currentTour.rating}`;
        heroImageElement.style.backgroundImage = `url('${currentTour.image}')`;
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
        summaryDate.textContent = bookingState.date ? bookingState.date : 'Select a date';
        summaryTime.textContent = bookingState.time.replace(' ', '').toLowerCase();
        summaryPersons.textContent = bookingState.persons;
        const total = bookingState.persons * bookingState.pricePerPerson;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
    }

    // --- 7. EVENT LISTENERS ---
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    prevMonthBtn.addEventListener('click', () => {
        const today = new Date();
        if (currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth > today.getMonth())) {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
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

    continueButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (!bookingState.date) {
        alert('Please select a date before continuing.');
        return;
    }
    
    // Calcula el total antes de guardar
    const total = bookingState.persons * bookingState.pricePerPerson;

    // Crea el objeto con todos los detalles de la reserva
    const bookingDetails = {
        id: tourId,
        title: currentTour.title,
        image: currentTour.image,
        date: bookingState.date,
        time: bookingState.time,
        persons: bookingState.persons,
        total: total.toFixed(2) // Guardamos el total ya calculado
    };

    // Guarda este único item en sessionStorage
    sessionStorage.setItem('checkoutItem', JSON.stringify(bookingDetails));

    // Redirige a la nueva página de checkout
    window.location.href = 'checkout.html'; // <-- ¡Cambio importante!
});

    // --- 8. INICIALIZACIÓN ---
    populatePage();
    populateFaqs();
    updateSummary();
    renderCalendar(currentMonth, currentYear);
});