document.addEventListener('DOMContentLoaded', () => {

    const postsData = [
        {
            id: 1,
            link: '../blog/post-1.html',
            title: 'Machu Picchu',
            meta: 'November 06, 2017 - Cameron Metreaud',
            excerpt: 'Machu Picchu, also known as Pata Llacta the lost city of the Incas, is one of the earth’s ancient megastructures of great historical value...',
            quote: '“Before, the only way to see the Nasca lines was to travel to Nasca - usually by bus. But now we fly from Pisco and people prefer it.”',
            images: [ '../assets/img/machu_picchu_p.jpg', '../assets/img/machu_picchu_p.2.jpg', '../assets/img/nazca_p.1.jpg' ]
        },
        {
            id: 2,
            link: 'post-monte-sierpe.html',
            title: 'Enigma del Monte Sierpe',
            meta: 'April 20, 2024 - Rein Petersen',
            excerpt: 'The geoglyphs at Monte Sierpe are one of Peru’s greatest mysteries, with massive serpent-like patterns carved into the desert...',
            quote: '“I believe that what appears to be a serpent is actually the deity Q\'hoa...”',
            images: [ '../assets/img/fondo_de_reviews.png', '../assets/img/bike_paracas_1_p.jpg', '../assets/img/Hero_Login.jpg' ]
        }
    ];

    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    postsData.forEach((post, index) => {
        let carouselItemsHTML = '';
        const numImages = post.images.length;

        // --- ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE! ---
        // Asignamos las clases 'prev', 'active' y 'next' desde el principio.
        post.images.forEach((image, imgIndex) => {
            let itemClass = '';
            if (imgIndex === 0) {
                itemClass = 'active'; // La primera imagen es la del centro (activa)
            } else if (imgIndex === 1) {
                itemClass = 'next'; // La segunda imagen es la de la derecha
            } else if (imgIndex === numImages - 1) {
                itemClass = 'prev'; // La última imagen es la de la izquierda
            }
            carouselItemsHTML += `<div class="carousel-item ${itemClass}"><img src="${image}" alt="${post.title}"></div>`;
        });

        const layoutClass = index % 2 === 0 ? 'layout-left' : 'layout-right';

        const postHTML = `
            <a href="${post.link}" class="post-summary-link">
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

    document.querySelectorAll('.post-summary').forEach(postElement => {
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

        // Ya no es estrictamente necesario llamar a updateCarousel(0) aquí, 
        // porque el estado inicial ya está en el HTML, pero lo dejamos por consistencia.
        updateCarousel(0);
        startAutoSlide();
    });
});