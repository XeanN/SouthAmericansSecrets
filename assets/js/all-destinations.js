document.addEventListener('DOMContentLoaded', () => {
    
    // Aquí está tu lista completa con todos los tours y paquetes unidos.
    const allDestinationsData = [
        // === Ica y Huacachina ===
        {
            name: 'Dune Buggy & Sandboard',
            category: 'Ica y Huacachina',
            url: '/tour/Coas of Peru/Ica y Huacachina/tourDuneBuggySandboardFalta.html',
            image: '/assets/img/machu_picchu_p.jpg'
        },
        {
            name: 'Tour de Viñedo, Museo y Oasis',
            category: 'Ica y Huacachina',
            url: '/tour/Coas of Peru/Ica y Huacachina/tourVineyardMuseumOasisTour.html',
            image: '/assets/img/tours/ica_vineyard.jpg'
        },

        // === Lima ===
        {
            name: 'Tour a Caral',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourCaral.html',
            image: '/assets/img/tours/lima_ccral.jpg'
        },
        {
            name: 'Sobrevuelo a las Líneas de Nazca desde Lima',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourFlightsOverNazca LinesFromLima(1-dayVipPrivate).html',
            image: '/assets/img/tours/lima_nazca_flight.jpg'
        },
        {
            name: 'City Tour en Lima',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourLimaCityTour.html',
            image: '/assets/img/tours/lima_city_tour.jpg'
        },
        {
            name: 'Tour de Museos de Lima',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourMuseumsOfLima.html',
            image: '/assets/img/tours/lima_museums.jpg'
        },
        {
            name: 'Tour de Vida Nocturna en Lima',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourNightlifeInLima.html',
            image: '/assets/img/tours/lima_nightlife.jpg'
        },
        {
            name: 'Tour a Pachacamac',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourPachacamac.html',
            image: '/assets/img/tours/lima_pachacamac.jpg'
        },
        {
            name: 'Tour Museo del Oro del Perú',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourPeruGold.html',
            image: '/assets/img/tours/lima_gold_museum.jpg'
        },

        // === Nazca Lines ===
        {
            name: 'Acueductos de Cantalloc',
            category: 'Nazca Lines',
            url: '/tour/Coas of Peru/Nazca Lines/tourCantallocAqueducts.html',
            image: '/assets/img/tours/nazca_aqueducts.jpg'
        },
        // ... (todos los demás tours de Nazca)

        // === North Coast ===
        {
            name: 'Tour a Chan Chan',
            category: 'North Coast',
            url: '/tour/Coas of Peru/North Coast/tourChanChan.html',
            image: '/assets/img/tours/north_chan_chan.jpg'
        },
        // ... (todos los demás tours de North Coast)

        // === Paracas y Islas Ballestas ===
        {
            name: 'Islas Ballestas para Cruceros (Primera Clase)',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourCruiseMemberIslasBallestasFirtsClass.html',
            image: '/assets/img/tours/paracas_cruise_first.jpg'
        },
        // ... (todos los demás tours de Paracas)
        {
            name: 'Alquiler de yates turísticos',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourYachtCharter.html',
            image: '/assets/img/tours/paracas_ballestas.jpg'
        },

        // === Manu Reserve ===
        {
            name: 'Manu Reserve Tour',
            category: 'Manu Reserve',
            url: '/tour/Rainforest/Manu Reserve/tourManuReserve.html',
            image: '/assets/img/tours/manu_reserve.jpg'
        },
        {
            name: 'Tambopata Reserve Tour (desde Manu)', 
            category: 'Manu Reserve',
            url: '/tour/Rainforest/Manu Reserve/tourTambopataReserve.html',
            image: '/assets/img/tours/tambopata_reserve.jpg'
        },

        // === Tambopata Rainforest ===
        {
            name: 'Manu Reserve Tour (desde Tambopata)',
            category: 'Tambopata Rainforest',
            url: '/tour/Rainforest/Tambopata Rainforest/tourManuReserve.html',
            image: '/assets/img/tours/manu_reserve.jpg'
        },
        {
            name: 'Tambopata Reserve Tour',
            category: 'Tambopata Rainforest',
            url: '/tour/Rainforest/Tambopata Rainforest/tourTambopataReserve.html',
            image: '/assets/img/tours/tambopata_reserve.jpg'
        },

        // === Arequipa (The Highlands) ===
        {
            name: 'Arequipa City Tour',
            category: 'Arequipa',
            url: '/tour/The Highlands/Arequipa/tourArequipaCity.html',
            image: '/assets/img/tours/arequipa_city.jpg'
        },
        {
            name: 'Colca Canyon Tour',
            category: 'Arequipa',
            url: '/tour/The Highlands/Arequipa/tourColcaCanyon.html',
            image: '/assets/img/tours/colca_canyon.jpg'
        },

        // === Cuzco (The Highlands) ===
        {
            name: 'Cuzco City Tour',
            category: 'Cuzco',
            url: '/tour/The Highlands/Cuzco/tourCuzcoCity.html',
            image: '/assets/img/tours/cuzco_city.jpg'
        },
        // ... (todos los demás tours de Cuzco)
        {
            name: 'White Water Rafting',
            category: 'Cuzco',
            url: '/tour/The Highlands/Cuzco/tourWhiteWaterRafting.html',
            image: '/assets/img/tours/white_water_rafting.jpg'
        },

        // === Lake Titicaca (The Highlands) ===
        {
            name: 'Lake Titicaca Boat Tour',
            category: 'Lake Titicaca',
            url: '/tour/The Highlands/Lake Titicaca/tourLakeTiticacaBoat.html',
            image: '/assets/img/tours/lake_titicaca.jpg'
        },
        
        // === Shore Excursions (Callao) ===
        {
            name: 'Shore Excursions to Larco Museum',
            category: 'Cruceros desde Callao',
            url: '/ShoreExcursions/FromCallaoCruiseTerminal/tourShoreExcursionsLarcoMuseum.html',
            image: '/assets/img/tours/larco_museum.jpg'
        },
        {
            name: 'Shore Excursions to Pachacamac',
            category: 'Cruceros desde Callao',
            url: '/ShoreExcursions/FromCallaoCruiseTerminal/tourShoreExcursionstoPachacamacArchaeological.html',
            image: '/assets/img/tours/pachacamac.jpg'
        },

        // === Shore Excursions (Salaverry) ===
        {
            name: 'Shore Excursions to Chan Chan',
            category: 'Cruceros desde Salaverry',
            url: '/ShoreExcursions/FromSalaverryCruiseTerminal/tourShoreExcursionsChanChan.html',
            image: '/assets/img/tours/chan_chan.jpg'
        },

        // === Shore Excursions (Pisco/Paracas) ===
        {
            name: 'Nazca Lines Flight',
            category: 'Cruceros desde Pisco/Paracas',
            url: '/ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourNazcaLinesFlight.html',
            image: '/assets/img/tours/nazca_lines.jpg'
        },
        {
            name: 'Shore Excursions to Islas Ballestas',
            category: 'Cruceros desde Pisco/Paracas',
            url: '/ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourShoreExcursionsIslasBallestas.html',
            image: '/assets/img/tours/islas_ballestas.jpg'
        },
        {
            name: 'Shore Excursions to Tambo Colorado',
            category: 'Cruceros desde Pisco/Paracas',
            url: '/ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourShoreExcursionsTamboColorado.html',
            image: '/assets/img/tours/tambo_colorado.jpg'
        },


        // === Peru Packages (¡Añadidos aquí!) ===
        {
            name: 'Machu Picchu & The Sacred Valley of Incas',
            category: 'Peru Packages',
            url: '/PeruPackages/MachuPicchuYTheSecretValleyofIncas/tourMachuPicchu&ValleyIncas.html',
            image: '/assets/img/tours/package_machu_picchu_valley.jpg'
        },

        // MysetrioesOfTheSouthCoast(2Days/1 night) ===
        {
            name: 'Mysteries of The South Coast (2 Days / 1 Night)',
            category: 'MysetrioesOfTheSouthCoast',
            url: '/PeruPackages/MysetrioesOfTheSouthCoast/tourNazcaLinesFlightSouthCoast.html',
            image: '/assets/img/tours/package_south_coast.jpg'
        },
        {
            name: 'VIP Upgrade for South Coast Tour',
            category: 'MysetrioesOfTheSouthCoast',
            url: '/PeruPackages/MysetrioesOfTheSouthCoast/tourUpgradeToVip.html',
            image: '/assets/img/tours/package_vip_upgrade.jpg'
        }
    ];

    const gridContainer = document.querySelector('.all-destinations-grid');
    if (!gridContainer) return;

    const categoryToDisplay = gridContainer.dataset.category;

    const filteredList = allDestinationsData.filter(city => {
        if (!categoryToDisplay || categoryToDisplay === 'all') {
            return true; 
        }
        return city.category === categoryToDisplay;
    });

    filteredList.forEach(city => {
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