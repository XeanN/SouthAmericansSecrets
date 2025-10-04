// ==========================================================================
// SCRIPT PARA EL CARRUSEL DE DESTINOS DESTACADOS (FEATURED)
// assets/js/featured.js
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. DATOS DE LOS DESTINOS DESTACADOS (Nuestra "Base de Datos")
    // --------------------------------------------------------------------------
    const featuredData = [
        {
            image: 'assets/img/machu_picchu_p.2.jpg',
            title: 'Machu Picchu',
            meta: 'November 06, 2017 · Cameron Metreaud',
            description: 'Machu Picchu, also known as Pata Llacta the lost city of the Incas, is one of the earth’s ancient megastructures of great historical value. Most recently it has been recognized as one of the seven wonders of the modern world. This impressing archaeological site has been steadily growing in popularity and currently receives over 2500 tourists daily. Veteran guide Lucio explains that “due to increasing demand, the areas accessible to visitors are reduced and increasingly restricted every year.” Today the visitors are still able to go inside and touch most the ancient structures of Machu Picchu allowing for a very intimate and personal experience. In coming years the tours will be restricted to fenced-off pathways and single file lines.',
            quote: '“Before, the only way to see the Nasca lines was to travel to Nasca - usually by bus. But now we fly from Pisco and people prefer it.”'
        },
        {
            image: 'assets/img/nazca_p.1.jpg',
            title: 'Huacachina Oasis',
            meta: 'January 12, 2020 · Alex Rodriguez',
            description: 'A true desert oasis, Huacachina is a stunning lagoon surrounded by massive sand dunes. It is a hub for adventure sports like sandboarding and dune buggy rides, offering a unique experience in the Peruvian landscape.',
            quote: '“The sunset over the dunes is something you will never forget. The colors are simply breathtaking.”'
        },
        {
            image: 'assets/img/machu_picchu_p.jpg',
            title: 'Paracas National Reserve',
            meta: 'March 22, 2023 · Maria Garcia',
            description: 'This protected area is a sanctuary for marine life, including sea lions, dolphins, and countless bird species. The dramatic cliffs and red-sand beaches create a landscape unlike any other in Peru.',
            quote: '“Seeing the wildlife in its natural habitat was a profound experience. A must-see for nature lovers.”'
        }
    ];

    // --------------------------------------------------------------------------
    // 2. SELECCIÓN DE ELEMENTOS DEL DOM (Conectando los "cables" al HTML)
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
    // 3. FUNCIÓN PRINCIPAL (El "Director de Orquesta")
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
    // 4. INICIALIZACIÓN (Montando el "escenario" una sola vez)
    // --------------------------------------------------------------------------
    featuredData.forEach((data, i) => {
        // Crear cada slide del carrusel
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        item.innerHTML = `<img src="${data.image}" alt="${data.title}">`;
        carousel.appendChild(item);
        
        // Crear cada punto de navegación
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => updateFeaturedSection(i));
        dotsContainer.appendChild(dot);
    });

    // --------------------------------------------------------------------------
    // 5. EVENT LISTENERS (Los "botones de control" del usuario)
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
    // 6. LLAMADA INICIAL (¡Que empiece la función!)
    // --------------------------------------------------------------------------
    updateFeaturedSection(0);
});