document.addEventListener('DOMContentLoaded', () => {
    
    // PASO 1: Añadimos la propiedad "url" a cada destino.
    // Asegúrate de que estos nombres de archivo coincidan con tus archivos HTML.
    const allDestinationsData = [
        // === Ica y Huacachina ===
        {
            name: 'Dune Buggy & Sandboard',
            category: 'Ica y Huacachina',
            url: '../tour/Coas of Peru/Ica y Huacachina/tourDuneBuggySandboardFalta.html',
            image: 'assets/img/machu_picchu_p.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour de Viñedo, Museo y Oasis',
            category: 'Ica y Huacachina',
            url: '../tour/Coas of Peru/Ica y Huacachina/tourVineyardMuseumOasisTour.html',
            image: 'assets/img/tours/ica_vineyard.jpg' // Imagen de ejemplo
        },

        // === Lima ===
        {
            name: 'Tour a Caral',
            category: 'Lima',
            url: '../tour/Coas of Peru/Lima/tourCaral.html',
            image: 'assets/img/tours/lima_ccral.jpg' // Imagen de ejemplo
        },
        {
            name: 'Sobrevuelo a las Líneas de Nazca desde Lima',
            category: 'Lima',
            url: '../tour/Coas of Peru/Lima/tourFlightsOverNazca LinesFromLima(1-dayVipPrivate).html',
            image: 'assets/img/tours/lima_nazca_flight.jpg' // Imagen de ejemplo
        },
        {
            name: 'City Tour en Lima',
            category: 'Lima',
            url: '../tour/Coas of Peru/Lima/tourLimaCityTour.html',
            image: 'assets/img/tours/lima_city_tour.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour de Museos de Lima',
            category: 'Lima',
            url: '../tour/Coas of Peru/Lima/tourMuseumsOfLima.html',
            image: 'assets/img/tours/lima_museums.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour de Vida Nocturna en Lima',
            category: 'Lima',
            url: '../tour/Coas of Peru/Lima/tourNightlifeInLima.html',
            image: 'assets/img/tours/lima_nightlife.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour a Pachacamac',
            category: 'Lima',
            url: '../tour/Coas of Peru/Lima/tourPachacamac.html',
            image: 'assets/img/tours/lima_pachacamac.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour Museo del Oro del Perú',
            category: 'Lima',
            url: '../tour/Coas of Peru/Lima/tourPeruGold.html',
            image: 'assets/img/tours/lima_gold_museum.jpg' // Imagen de ejemplo
        },

        // === Nazca Lines ===
        {
            name: 'Acueductos de Cantalloc',
            category: 'Nazca Lines',
            url: '../tour/Coas of Peru/Nazca Lines/tourCantallocAqueducts.html',
            image: 'assets/img/tours/nazca_aqueducts.jpg' // Imagen de ejemplo
        },
        {
            name: 'Cementerio de Chauchilla',
            category: 'Nazca Lines',
            url: '../tour/Coas of Peru/Nazca Lines/tourChauchillaCemetery.html',
            image: 'assets/img/tours/nazca_cemetery.jpg' // Imagen de ejemplo
        },
        {
            name: 'Vuelo sobre las Líneas de Nazca desde Lima (1 día VIP Privado)',
            category: 'Nazca Lines',
            url: '../tour/Coas of Peru/Nazca Lines/tourFlightsOverNazca LinesFromLima(1-dayVipPrivate).html',
            image: 'assets/img/tours/nazca_cemetery.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour Líneas de Nazca',
            category: 'Nazca Lines',
            url: '../tour/Coas of Peru/Nazca Lines/tourNazcaLines.html',
            image: 'assets/img/tours/nazca_cemetery.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour Líneas de Nazca Desde Paracas Pre2no',
            category: 'Nazca Lines',
            url: '../tour/Coas of Peru/Nazca Lines/tourNazcaLinesFromParacasPre2no.html',
            image: 'assets/img/tours/nazca_cemetery.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour Reserva Pampas Galeras',
            category: 'Nazca Lines',
            url: '../tour/Coas of Peru/Nazca Lines/tourPampasGalerasReserve.html',
            image: 'assets/img/tours/nazca_cemetery.jpg' // Imagen de ejemplo
        },
        // ... (He omitido algunos de Nazca por brevedad, sigue el mismo patrón)

        // === North Coast ===
        {
            name: 'Tour a Chan Chan',
            category: 'North Coast',
            url: '../tour/Coas of Peru/North Coast/tourChanChan.html',
            image: 'assets/img/tours/north_chan_chan.jpg' // Imagen de ejemplo
        },
        {
            name: 'Manglares de Tumbes',
            category: 'North Coast',
            url: '../tour/Coas of Peru/North Coast/tourMangrovesOfTumbes.html',
            image: 'assets/img/tours/north_mangroves.jpg' // Imagen de ejemplo
        },
        {
            name: 'Snorkel con Tortugas',
            category: 'North Coast',
            url: '../tour/Coas of Peru/North Coast/tourSnorkelWithTurtles.html',
            image: 'assets/img/tours/north_turtles.jpg' // Imagen de ejemplo
        },
        {
            name: 'Templo de la Luna',
            category: 'North Coast',
            url: '../tour/Coas of Peru/North Coast/tourTempleOfTheMoon.html',
            image: 'assets/img/tours/north_moon_temple.jpg' // Imagen de ejemplo
        },

        // === Paracas y Islas Ballestas ===
        {
            name: 'Islas Ballestas para Cruceros (Primera Clase)',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourCruiseMemberIslasBallestasFirtsClass.html',
            image: 'assets/img/tours/paracas_cruise_first.jpg' // Imagen de ejemplo
        },
        {
            name: 'Islas Ballestas para Cruceros (Standard)',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourCruiseMemberIslasBallestasStandardTour.html',
            image: 'assets/img/tours/paracas_cruise_std.jpg' // Imagen de ejemplo
        },
        {
            name: 'Excursiones para Cruceros',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourCruiseShoreEscursions.html',
            image: 'assets/img/tours/paracas_shore_excursion.jpg' // Imagen de ejemplo
        },
        {
            name: 'Dune Buggy y Sandboard en Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourDuneBuggySandboard.html',
            image: 'assets/img/tours/paracas_buggy.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour Islas Ballestas',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourIslasBallestas.html',
            image: 'assets/img/tours/paracas_ballestas.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour Islas Ballestas<br>(Primera Clase)',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourIslasBallestasFirstClass.html',
            image: 'assets/img/tours/paracas_ballestas.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour en kayak por la bahía de Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourKayakParacasBay.html',
            image: 'assets/img/tours/paracas_ballestas.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour Líneas de Nazca desde Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourNazcaLinesFromParacas.html',
            image: 'assets/img/tours/paracas_ballestas.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour Reserva Nacional de Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourParacasNationalReserve.html',
            image: 'assets/img/tours/paracas_ballestas.jpg' // Imagen de ejemplo
        },
        {
            name: 'Tour privado',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourPrivateTour.html',
            image: 'assets/img/tours/paracas_ballestas.jpg' // Imagen de ejemplo
        },
        {
            name: 'Alquiler de yates turísticos',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coas of Peru/Paracas y Islas Ballestas/tourYachtCharter.html',
            image: 'assets/img/tours/paracas_ballestas.jpg' // Imagen de ejemplo
        },
        // ... (He omitido algunos de Paracas por brevedad, sigue el mismo patrón)
    ];


    const gridContainer = document.querySelector('.all-destinations-grid');
    if (!gridContainer) return;

    // =========================================================
    // ===== INICIO: AQUÍ ESTÁ LA ÚNICA LÓGICA QUE AÑADIMOS =====
    // =========================================================

    // 1. Leemos la instrucción de categoría desde el 'data-category' en tu HTML
    const categoryToDisplay = gridContainer.dataset.category;

    // 2. Creamos una nueva lista filtrada a partir de tu lista original
    const filteredList = allDestinationsData.filter(city => {
        // Si la página no especifica categoría o dice "all", mostramos todo
        if (!categoryToDisplay || categoryToDisplay === 'all') {
            return true; 
        }
        // Si no, solo mostramos los que coinciden con la categoría
        return city.category === categoryToDisplay;
    });

    // =========================================================
    // ===== FIN: AQUÍ TERMINA LA LÓGICA AÑADIDA             =====
    // =========================================================

    // Ahora, en lugar de recorrer 'allDestinationsData', recorremos la nueva 'filteredList'
    filteredList.forEach(city => {
        // PASO 2: Envolvemos toda la tarjeta en una etiqueta <a>
        // y usamos la propiedad "url" en el atributo href.
        const cardHTML = `
            <a href="${city.url}" class="destination-item-card">
                <img src="${city.image}" alt="Destino: ${city.name}">
                <div class="city-name">
                    <span>${city.name}</span>
                </div>
            </a>
        `;
        gridContainer.innerHTML += cardHTML;
    });

});