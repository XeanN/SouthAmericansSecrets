document.addEventListener('DOMContentLoaded', () => {

    // 1. DETECCIÓN DE IDIOMA
    // Si la URL contiene '/es/', asumimos que queremos el idioma español.
    const isSpanish = window.location.pathname.includes("/es/");
    
    // 2. DATA EN INGLÉS (BASE)
    const postsDataEn = [
        {
            id: 1,
            link: '../blog/post-1.html',
            title: 'Machu Picchu',
            meta: 'November 06, 2017 - Cameron Metreaud',
            excerpt: 'Machu Picchu, also known as Pata Llacta the lost city of the Incas, is one of the earth’s ancient megastructures of great historical value...',
            quote: '“Before, the only way to see the Nasca lines was to travel to Nasca - usually by bus. But now we fly from Pisco and people prefer it.”',
            images: [ '../assets/img/SIerra/Cuzco/Tour-de-Cuzco/109.jpg', '../assets/img/SIerra/Cuzco/Tour-de-Cuzco/110.jpg', '../assets/img/SIerra/Cuzco/Tour-de-Cuzco/111.jpg' ]
        },
        {
            id: 2,
            link: '../blog/post-2.html',
            title: 'Enigma del Monte Sierpe',
            meta: 'April 20, 2014 - Rein Petersen',
            excerpt: 'The geoglyphs at Monte Sierpe are one of Peru’s greatest mysteries, with massive serpent-like patterns carved into the desert. Their origin and purpose remain unknown, adding to their allure.Getting to Nasca to see the famous Nasca Lines used to be difficult, requiring a long 7-8 hour drive from Lima. Unless you chartered a private flight, public transport options were limited and time-consuming. Fortunately, access has improved, making it easier for travelers to visit and experience Peru’s ancient wonders from the sky.',
            quote: '“I believe that what appears to be a serpent is actually the deity Qhoa. He was the servant or acolyte of the god of water known as Illapa and his likeness was used in a majority of rituals regarding rain” ',
            images: [ '../assets/img/EnigmadelMonteSierpe1.jpg', '../assets/img/EnigmadelMonteSierpe2.jpg', '../assets/img/EnigmadelMonteSierpe3.jpg' ]
        },
        {
            id: 3,
            link: '../blog/post-3.html',
            title: 'Guano Collectors',
            meta: 'February 22, 2014 - Rein Peterson',
            excerpt: 'Guano, once a highly coveted resource during the 19th century, is making a resurgence as synthetic fertilizer costs rise. On North Guañape Island, off the coast of Peru, workers collect seabird dung, prized for its high nutrient content. This labor is physically demanding, with heat, exhaustion, and the smell posing constant challenges. But as worker Domingo León explains, “The worst enemy is the dust—sticking to our eyebrows, covering our noses and cheeks, turning our faces into rigid masks.” Despite the harsh conditions, the global demand for guano is soaring once again, fueling this unique industry.',
            quote: '“The worst enemy is not the smell, heat or exhaustion... [it] is dust sticking on the eyebrows, covering our noses and cheeks and turning our face into a rigid mask.” ',
            images: [ '../assets/img/GuanoCollectors1.jpg', '../assets/img/GuanoCollectors2.jpg', '../assets/img/GuanoCollectors3.jpg' ]
        },
        {
            id: 4,
            link: '../blog/post-4.html',
            title: 'Nasca Lines from Pisco',
            meta: 'February 26, 2014 - Rein Petersen',
            excerpt: 'Getting to Nasca to see the Nasca lines once used to be a complicated and time-consuming effort. Unless you chartered your own private flight from Lima, public access was limited to mostly car or bus which is very long (7-8 hour one-way) trip from Lima.',
            quote: '“Before, the only way to see the Nasca lines was to travel to Nasca - usually by bus. But now we fly from Pisco and people prefer it.” ',
            images: [ '../assets/img/Costa/LineasNazca/Líneas_de_Nazca_desde_Paracas/46.jpg', '../assets/img/Costa/LineasNazca/Líneas_de_Nazca_desde_Paracas/47.jpg', '../assets/img/Costa/LineasNazca/Líneas_de_Nazca_desde_Paracas/48.jpg' ]
        },
    ];

    // 3. DATA EN ESPAÑOL (TRADUCIDA)
    const postsDataEs = [
        {
            id: 1,
            link: '../blog/post-1.html', // NOTA: Asume que el archivo en /es/ se llama igual
            title: 'Machu Picchu', // Nombres propios se suelen dejar
            meta: '06 de Noviembre, 2017 - Cameron Metreaud',
            excerpt: 'Machu Picchu, también conocida como Pata Llacta, la ciudad perdida de los Incas, es una de las antiguas megaestructuras de la tierra de gran valor histórico...',
            quote: '“Antes, la única forma de ver las Líneas de Nazca era viajar a Nazca, generalmente en autobús. Pero ahora volamos desde Pisco y la gente lo prefiere.”',
            images: [ '../../assets/img/SIerra/Cuzco/Tour-de-Cuzco/109.jpg', '../../assets/img/SIerra/Cuzco/Tour-de-Cuzco/110.jpg', '../../assets/img/SIerra/Cuzco/Tour-de-Cuzco/111.jpg' ]
        },
        {
            id: 2,
            link: '../blog/post-2.html',
            title: 'Enigma del Monte Sierpe',
            meta: '20 de Abril, 2014 - Rein Petersen',
            excerpt: 'Los geoglifos en Monte Sierpe son uno de los mayores misterios de Perú, con patrones masivos similares a serpientes tallados en el desierto. Su origen y propósito siguen siendo desconocidos, lo que aumenta su atractivo. Ir a Nazca para ver las famosas Líneas de Nazca solía ser difícil, requiriendo un largo viaje de 7-8 horas en autobús desde Lima. Afortunadamente, el acceso ha mejorado, facilitando a los viajeros visitar y experimentar las antiguas maravillas de Perú desde el cielo.',
            quote: '“Creo que lo que parece ser una serpiente es en realidad la deidad Qhoa. Él fue el sirviente o acólito del dios del agua conocido como Illapa y su semejanza fue utilizada en la mayoría de los rituales relacionados con la lluvia” ',
            images: [ '../../assets/img/EnigmadelMonteSierpe1.jpg', '../../assets/img/EnigmadelMonteSierpe2.jpg', '../../assets/img/EnigmadelMonteSierpe3.jpg' ]
        },
        {
            id: 3,
            link: '../blog/post-3.html',
            title: 'Recolectores de Guano',
            meta: '22 de Febrero, 2014 - Rein Peterson',
            excerpt: 'El guano, un recurso muy codiciado durante el siglo XIX, está resurgiendo a medida que aumentan los costos de los fertilizantes sintéticos. En la Isla Guañape Norte, frente a la costa de Perú, los trabajadores recolectan estiércol de aves marinas, valorado por su alto contenido de nutrientes. Esta labor es físicamente exigente, con el calor, el agotamiento y el olor planteando desafíos constantes. Pero como explica el trabajador Domingo León, “El peor enemigo es el polvo, que se pega en nuestras cejas, cubriendo nuestras narices y mejillas, convirtiendo nuestra cara en una máscara rígida.” A pesar de las duras condiciones, la demanda global de guano se está disparando una vez más, impulsando esta industria única.',
            quote: '“El peor enemigo no es el olor, el calor o el agotamiento... [es] el polvo que se pega en las cejas, cubriendo nuestras narices y mejillas y convirtiendo nuestra cara en una máscara rígida.” ',
            images: [ '../../assets/img/GuanoCollectors1.jpg', '../../assets/img/GuanoCollectors2.jpg', '../../assets/img/GuanoCollectors3.jpg' ]
        },
        {
            id: 4,
            link: '../blog/post-4.html',
            title: 'Líneas de Nazca desde Pisco',
            meta: '26 de Febrero, 2014 - Rein Petersen',
            excerpt: 'Llegar a Nazca para ver las Líneas de Nazca solía ser un esfuerzo complicado y lento. A menos que alquilaras tu propio vuelo privado desde Lima, el acceso público se limitaba principalmente a un viaje muy largo en coche o autobús (7-8 horas de ida) desde Lima.',
            quote: '“Antes, la única forma de ver las Líneas de Nazca era viajar a Nazca, generalmente en autobús. Pero ahora volamos desde Pisco y la gente lo prefiere.” ',
            images: [ '../../assets/img/Costa/LineasNazca/Líneas_de_Nazca_desde_Paracas/46.jpg', '../../assets/img/Costa/LineasNazca/Líneas_de_Nazca_desde_Paracas/47.jpg', '../../assets/img/Costa/LineasNazca/Líneas_de_Nazca_desde_Paracas/48.jpg' ]
        },
    ];

    // 4. SELECCIÓN DE DATOS Y CORRECCIÓN DE RUTAS
    const postsData = isSpanish ? postsDataEs : postsDataEn;
    // Base de la ruta para los enlaces de los posts (de /blog/ a /es/blog/ o /blog/)
    const linkPrefix = isSpanish ? '../' : ''; 
    
    // 5. RENDERIZADO
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    postsData.forEach((post, index) => {
        
        // CORRECCIÓN DE RUTA DE IMAGEN DINÁMICA
        // Las imágenes dentro del JS necesitan un nivel más (../../) si estamos en /es/blog/
        // O solo uno (../) si estamos en /blog/
        const imagePrefix = isSpanish ? '../../' : '../'; 

        let carouselItemsHTML = '';
        const numImages = post.images.length;

        post.images.forEach((image, imgIndex) => {
            let itemClass = '';
            if (imgIndex === 0) {
                itemClass = 'active';
            } else if (imgIndex === 1) {
                itemClass = 'next';
            } else if (imgIndex === numImages - 1) {
                itemClass = 'prev';
            }
            // NOTA: Aquí agregamos el prefijo de imagen corregido
            carouselItemsHTML += `<div class="carousel-item ${itemClass}"><img src="${imagePrefix}${image.replace('../', '')}" alt="${post.title}"></div>`;
        });

        const layoutClass = index % 2 === 0 ? 'layout-left' : 'layout-right';

        const postHTML = `
            <a href="${linkPrefix}${post.link.replace('../', '')}" class="post-summary-link">
                <article class="post-summary ${layoutClass}" id="post-${post.id}">
                    <section class="featured">
                        <div class="container">
                            <div class="carousel-container">
                                <div class="carousel">${carouselItemsHTML}</div>
                                <div class="carousel-nav">
                                    <button class="carousel-arrow prev">‹</button>
                                    <div class="carousel-dots"></div>
                                    <button class="carousel-arrow next">›</button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="post-summary-content">
                        <h2 class="post-summary-title">${post.title}</h2>
                        <p class="post-summary-meta">${post.meta}</p>
                        <div class="post-summary-excerpt"><p>${post.excerpt}</p></div>
                        <blockquote class="post-summary-quote">${post.quote}</blockquote>
                    </div>
                </article>
            </a>
        `;
        postsContainer.innerHTML += postHTML;
    });

    // --- LÓGICA DE CAROUSEL (SE MANTIENE IGUAL) ---
    document.querySelectorAll('.post-summary').forEach(postElement => {
        // ... (Lógica de inicialización del carousel, dots, prev/next buttons)
        const carousel = postElement.querySelector('.carousel');
        const dotsContainer = postElement.querySelector('.carousel-dots');
        const prevBtn = postElement.querySelector('.carousel-arrow.prev');
        const nextBtn = postElement.querySelector('.carousel-arrow.next');
        const items = postElement.querySelectorAll('.carousel-item');
        
        if (!carousel || items.length === 0) return;

        let currentIndex = 0;
        let autoSlideInterval;

        function updateCarousel(index) {
            items.forEach((item, i) => {
                item.classList.remove('active', 'prev', 'next');
                if (i === index) item.classList.add('active');
                else if (i === (index - 1 + items.length) % items.length) item.classList.add('prev');
                else if (i === (index + 1) % items.length) item.classList.add('next');
            });
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            currentIndex = index;
        }

        items.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => updateCarousel(i));
            dotsContainer.appendChild(dot);
        });

        prevBtn.addEventListener('click', (e) => { e.preventDefault(); updateCarousel((currentIndex - 1 + items.length) % items.length); });
        nextBtn.addEventListener('click', (e) => { e.preventDefault(); updateCarousel((currentIndex + 1) % items.length); });
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                updateCarousel((currentIndex + 1) % items.length);
            }, 4000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        postElement.addEventListener('mouseenter', stopAutoSlide);
        postElement.addEventListener('mouseleave', startAutoSlide);

        updateCarousel(0);
        startAutoSlide();
    });
});