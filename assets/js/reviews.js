// Espera a que todo el contenido del HTML esté cargado
document.addEventListener('DOMContentLoaded', function() {

    // 1. DETECCIÓN DE IDIOMA
    const isSpanish = window.location.pathname.includes("/es/");

    // 2. CORRECCIÓN DE RUTA DE IMAGEN DINÁMICA
    // Si estamos en /es/index.html, las imágenes necesitan subir un nivel (../)
    const pathPrefix = isSpanish ? "../" : "";

    // 3. DATOS EN INGLÉS (ORIGINAL)
    const reviewsDataEn = [
        {
            name: "Borys Ł",
            avatar: "assets/img/reviews/reviews_1.jpg", 
            role: "September 2025 • Friends",
            text: "I love Lucio, the best tour guide in the United States <3 The islands are even more beautiful with such an amazing guide. I would 100% go back."
        },
        {
            name: "柏寧黃",
            avatar: "assets/img/reviews/reviews_2.jpg", 
            role: "September 2025 • Couples",
            text: "We had an amazing trip to Paracas! I highly recommend choosing a tour here — the team was very attentive, helpful, and went out of their way to assist us in many ways."
        },
        {
            name: "Mira K",
            avatar: "assets/img/reviews/reviews_3.jpg", 
            role: "August 2025 • Couples",
            text: "The nature reserve was truly impressive, and our guide, Lucio, showed us and told us many interesting things. He was very friendly and explained everything clearly. I would definitely recommend the tour!"
        },
        {
            name: "李小姐374",
            avatar: "assets/img/reviews/reviews_4.jpg", 
            role: "June 2025 • Friends",
            text: "Our guide was very friendly and professional. He showed us and introduced us to many animals. The penguins were so cute! I didn't know there were penguins in Peru. I highly recommend this trip."
        }
    ];

    // 4. DATOS EN ESPAÑOL (TRADUCIDOS)
    const reviewsDataEs = [
        {
            name: "Borys Ł",
            avatar: "assets/img/reviews/reviews_1.jpg", 
            role: "Septiembre 2025 • Amigos",
            text: "Amo a Lucio, el mejor guía turístico <3 Las islas son aún más hermosas con un guía tan increíble. Volvería al 100%."
        },
        {
            name: "柏寧黃",
            avatar: "assets/img/reviews/reviews_2.jpg", 
            role: "Septiembre 2025 • Parejas",
            text: "¡Tuvimos un viaje increíble a Paracas! Recomiendo encarecidamente elegir un tour aquí: el equipo fue muy atento, servicial y se desvivió por ayudarnos de muchas maneras."
        },
        {
            name: "Mira K",
            avatar: "assets/img/reviews/reviews_3.jpg", 
            role: "Agosto 2025 • Parejas",
            text: "La reserva natural fue realmente impresionante, y nuestro guía, Lucio, nos mostró y contó muchas cosas interesantes. Fue muy amable y explicó todo claramente. ¡Definitivamente recomendaría el tour!"
        },
        {
            name: "李小姐374",
            avatar: "assets/img/reviews/reviews_4.jpg", 
            role: "Junio 2025 • Amigos",
            text: "Nuestro guía fue muy amable y profesional. Nos mostró y nos presentó a muchos animales. ¡Los pingüinos eran tan lindos! No sabía que había pingüinos en Perú. Recomiendo encarecidamente este viaje."
        }
    ];

    // 5. SELECCIÓN DE DATOS
    const reviewsData = isSpanish ? reviewsDataEs : reviewsDataEn;

    // --- PASO 2: SELECCIONA LOS ELEMENTOS DEL HTML ---
    const cardContainer = document.getElementById('testimonial-card-container');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    
    // Si no existe el contenedor (por ejemplo en otras páginas), detenemos el script
    if (!cardContainer) return;

    // Variable para saber qué testimonio se está mostrando
    let currentIndex = 0;

    // --- PASO 3: FUNCIÓN PARA MOSTRAR UN TESTIMONIO ---
    function showReview(index) {
        const review = reviewsData[index];
        
        // Aplica un efecto de desvanecimiento para una transición suave
        cardContainer.style.opacity = '0';

        setTimeout(() => {
            // Genera el HTML de la tarjeta usando los datos del array
            // APLICAMOS pathPrefix a la imagen aquí
            cardContainer.innerHTML = `
                <div class="testimonial-card">
                    <p class="testimonial-text">${review.text}</p>
                    <div class="client-info">
                        <img class="client-img" src="${pathPrefix}${review.avatar}" alt="Foto de ${review.name}">
                        <div class="client-details">
                            <h4>${review.name}</h4>
                            <span>${review.role}</span>
                        </div>
                    </div>
                </div>
            `;
            // Vuelve a mostrar el contenedor con el nuevo contenido
            cardContainer.style.opacity = '1';
        }, 250); // Este tiempo debe coincidir con la transición del CSS
    }

    // --- PASO 4: EVENTOS DE LOS BOTONES ---
    nextButton.addEventListener('click', () => {
        // Va al siguiente, y si llega al final, vuelve al primero (0)
        currentIndex = (currentIndex + 1) % reviewsData.length;
        showReview(currentIndex);
    });

    prevButton.addEventListener('click', () => {
        // Va al anterior, y si está en el primero, va al último
        currentIndex = (currentIndex - 1 + reviewsData.length) % reviewsData.length;
        showReview(currentIndex);
    });

    // --- PASO 5: MUESTRA EL PRIMER TESTIMONIO AL CARGAR LA PÁGINA ---
    showReview(currentIndex);

});