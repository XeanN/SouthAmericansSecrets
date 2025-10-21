// Espera a que todo el contenido del HTML esté cargado
document.addEventListener('DOMContentLoaded', function() {

    // --- PASO 1: DEFINE TUS RESEÑAS AQUÍ ---
    // Añade, edita o elimina objetos de este array para gestionar tus testimonios.
    const reviewsData = [
        {
            name: "Borys Ł",
            avatar: "assets/img/reviews/reviews_1.jpg", // Asegúrate de que la ruta sea correcta
            role: "Viajero • Amigos",
            text: "Amo a Lucio, el mejor guía turístico de Estados Unidos <3 Las islas son aún más hermosas con un guía tan increíble. 100% volvería."
        },
        {
            name: "柏寧黃",
            avatar: "assets/img/reviews/reviews_2.jpg", // Asegúrate de que la ruta sea correcta
            role: "Septiembre 2025 • Parejas",
            text: "¡Tuvimos un viaje increíble en Paracas! Recomiendo encarecidamente elegir un tour aquí — el equipo fue muy atento, atento y hizo todo lo posible para ayudarnos de muchas maneras."
        },
        {
            name: "Mira K",
            avatar: "assets/img/reviews/reviews_3.jpg", // Asegúrate de que la ruta sea correcta
            role: "Agosto 2025 • Parejas",
            text: "La reserva natural era muy impresionante y nuestro guía Lucio nos mostró y nos contó muchas cosas interesantes. Fue muy amable y explicó todo bien comprensible. ¡Definitivamente recomendaría el tour!"
        },
        {
            name: "李小姐374",
            avatar: "assets/img/reviews/reviews_4.jpg", // Asegúrate de que la ruta sea correcta
            role: "Junio 2025 • Amigos",
            text: "Nuestro guía fue muy amable y profesional. Mostró e introdujo muchos animales. ¡Los pingüinos eran tan lindos! No sabía que había pingüinos en Perú. Recomiendo mucho este viaje"
        }
    ];

    // --- PASO 2: SELECCIONA LOS ELEMENTOS DEL HTML ---
    const cardContainer = document.getElementById('testimonial-card-container');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    
    // Variable para saber qué testimonio se está mostrando
    let currentIndex = 0;

    // --- PASO 3: FUNCIÓN PARA MOSTRAR UN TESTIMONIO ---
    function showReview(index) {
        const review = reviewsData[index];
        
        // Aplica un efecto de desvanecimiento para una transición suave
        cardContainer.style.opacity = '0';

        setTimeout(() => {
            // Genera el HTML de la tarjeta usando los datos del array
            // ¡Nota que usamos la clase .testimonial-card que ya tenías estilizada!
            cardContainer.innerHTML = `
                <div class="testimonial-card">
                    <p class="testimonial-text">${review.text}</p>
                    <div class="client-info">
                        <img class="client-img" src="${review.avatar}" alt="Foto de ${review.name}">
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