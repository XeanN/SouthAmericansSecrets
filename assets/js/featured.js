// ==========================================================================
// SCRIPT PARA EL CARRUSEL DE DESTINOS DESTACADOS (FEATURED)
// assets/js/featured.js
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. DETECCIÓN DE IDIOMA
    const isSpanish = window.location.pathname.includes("/es/");
    
    // 2. CORRECCIÓN DE RUTA DE IMAGEN DINÁMICA
    // Si estamos en /es/index.html, las imágenes necesitan subir un nivel (../)
    const pathPrefix = isSpanish ? "../" : "";

    // --------------------------------------------------------------------------
    // 3. DATOS EN INGLÉS (Base)
    // --------------------------------------------------------------------------
    const featuredDataEn = [
        {
            image: 'assets/img/SIerra/Cuzco/Machu-Picchu-en-Un-Día/106.jpg',
            title: 'Machu Picchu',
            meta: 'November 06, 2017 · Cameron Metreaud',
            description: 'Machu Picchu, also known as Pata Llacta the lost city of the Incas, is one of the earth’s ancient megastructures of great historical value. Most recently it has been recognized as one of the seven wonders of the modern world. This impressing archaeological site has been steadily growing in popularity and currently receives over 2500 tourists daily. Veteran guide Lucio explains that “due to increasing demand, the areas accessible to visitors are reduced and increasingly restricted every year.” Today the visitors are still able to go inside and touch most the ancient structures of Machu Picchu allowing for a very intimate and personal experience. In coming years the tours will be restricted to fenced-off pathways and single file lines.',
            quote: '“Before, the only way to see the Nasca lines was to travel to Nasca - usually by bus. But now we fly from Pisco and people prefer it.”'
        },
        {
            image: 'assets/img/Costa/Ica_Huaca/Viñedo_MuseoOasis/16.jpg',
            title: 'Huacachina Oasis',
            meta: 'January 12, 2020 · Alex Rodriguez',
            description: 'A true desert oasis, Huacachina is a stunning lagoon surrounded by massive sand dunes. It is a hub for adventure sports like sandboarding and dune buggy rides, offering a unique experience in the Peruvian landscape.',
            quote: '“The sunset over the dunes is something you will never forget. The colors are simply breathtaking.”'
        },
        {
            image: 'assets/img/Costa/tours_Paracas/La_Reserva_Nacional_Paracas/70.jpg',
            title: 'Paracas National Reserve',
            meta: 'March 22, 2023 · Maria Garcia',
            description: 'This protected area is a sanctuary for marine life, including sea lions, dolphins, and countless bird species. The dramatic cliffs and red-sand beaches create a landscape unlike any other in Peru.',
            quote: '“Seeing the wildlife in its natural habitat was a profound experience. A must-see for nature lovers.”'
        }
    ];

    // 4. DATOS EN ESPAÑOL (Traducidos)
    // NOTA: Recuerda que los enlaces/rutas de las imágenes se mantienen aquí
    // pero la lógica de la ruta (pathPrefix) se aplica en el HTML final.
    const featuredDataEs = [
        {
            image: 'assets/img/SIerra/Cuzco/Machu-Picchu-en-Un-Día/106.jpg',
            title: 'Machu Picchu',
            meta: '06 de Noviembre, 2017 · Cameron Metreaud',
            description: 'Machu Picchu, también conocida como Pata Llacta, la ciudad perdida de los Incas, es una de las antiguas megaestructuras de la Tierra con un gran valor histórico. Recientemente ha sido reconocida como una de las siete maravillas del mundo moderno. Este impresionante sitio arqueológico ha crecido constantemente en popularidad y actualmente recibe más de 2500 turistas diarios. El guía veterano Lucio explica que “debido a la creciente demanda, las áreas accesibles a los visitantes se reducen y se restringen cada año más.” Hoy, los visitantes todavía pueden ingresar y tocar la mayoría de las estructuras antiguas de Machu Picchu, permitiendo una experiencia muy íntima y personal. En los próximos años, los tours se restringirán a senderos cercados y filas de una sola persona.',
            quote: '“Antes, la única forma de ver las Líneas de Nazca era viajar a Nazca, normalmente en autobús. Pero ahora volamos desde Pisco y la gente lo prefiere.”'
        },
        {
            image: 'assets/img/Costa/Ica_Huaca/Viñedo_MuseoOasis/16.jpg',
            title: 'Oasis de Huacachina',
            meta: '12 de Enero, 2020 · Alex Rodriguez',
            description: 'Un verdadero oasis en el desierto, Huacachina es una impresionante laguna rodeada de dunas de arena gigantes. Es un centro para deportes de aventura como sandboard y paseos en buggy, ofreciendo una experiencia única en el paisaje peruano.',
            quote: '“El atardecer sobre las dunas es algo que nunca olvidarás. Los colores son simplemente impresionantes.”'
        },
        {
            image: 'assets/img/Costa/tours_Paracas/La_Reserva_Nacional_Paracas/70.jpg',
            title: 'Reserva Nacional de Paracas',
            meta: '22 de Marzo, 2023 · María García',
            description: 'Esta área protegida es un santuario para la vida marina, incluyendo lobos marinos, delfines e innumerables especies de aves. Los acantilados dramáticos y las playas de arena roja crean un paisaje diferente a cualquier otro en Perú.',
            quote: '“Ver la vida salvaje en su hábitat natural fue una experiencia profunda. Una visita obligada para los amantes de la naturaleza.”'
        }
    ];

    // 5. SELECCIÓN DE LA FUENTE DE DATOS
    const featuredData = isSpanish ? featuredDataEs : featuredDataEn;

    // --------------------------------------------------------------------------
    // 6. SELECCIÓN DE ELEMENTOS DEL DOM (Conectando los "cables" al HTML)
    // --------------------------------------------------------------------------
    const carousel = document.querySelector('.carousel');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    
    const titleEl = document.getElementById('featured-title');
    const metaEl = document.getElementById('featured-meta');
    const descEl = document.getElementById('featured-description');
    const quoteEl = document.getElementById('featured-quote');

    // Si no existe el carrusel en esta página, detenemos el script.
    if (!carousel) return; 

    let currentIndex = 0;

    // --------------------------------------------------------------------------
    // 7. FUNCIÓN PRINCIPAL (El "Director de Orquesta")
    // --------------------------------------------------------------------------
    function updateFeaturedSection(index) {
        // --- a) Actualizar la información de texto ---
        const activeData = featuredData[index];
        titleEl.textContent = activeData.title;
        metaEl.textContent = activeData.meta;
        descEl.textContent = activeData.description;
        quoteEl.textContent = activeData.quote;

        // --- b) Actualizar las clases de los slides para el efecto visual ---
        const items = document.querySelectorAll('.carousel-item');
        items.forEach((item, i) => {
            item.classList.remove('active', 'prev', 'next');
            if (i === index) {
                item.classList.add('active');
            } else if (i === (index - 1 + items.length) % items.length) {
                item.classList.add('prev');
            } else if (i === (index + 1) % items.length) {
                item.classList.add('next');
            }
        });

        // --- c) Actualizar los puntos de navegación ---
        const dots = document.querySelectorAll('.carousel-dots .dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }

    // --------------------------------------------------------------------------
    // 8. INICIALIZACIÓN (Montando el "escenario" una sola vez)
    // --------------------------------------------------------------------------
    featuredData.forEach((data, i) => {
        // Crear cada slide del carrusel
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        // APLICAMOS LA CORRECCIÓN DE RUTA A LA IMAGEN AQUÍ
        item.innerHTML = `<img src="${pathPrefix}${data.image}" alt="${data.title}">`;
        carousel.appendChild(item);
        
        // Crear cada punto de navegación
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => updateFeaturedSection(i));
        dotsContainer.appendChild(dot);
    });

    // --------------------------------------------------------------------------
    // 9. EVENT LISTENERS (Los "botones de control" del usuario)
    // --------------------------------------------------------------------------
    prevBtn.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + featuredData.length) % featuredData.length;
        updateFeaturedSection(newIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % featuredData.length;
        updateFeaturedSection(newIndex);
    });

    // --------------------------------------------------------------------------
    // 10. LLAMADA INICIAL (¡Que empiece la función!)
    // --------------------------------------------------------------------------
    updateFeaturedSection(0);
});