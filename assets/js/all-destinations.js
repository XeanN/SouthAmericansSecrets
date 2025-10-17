document.addEventListener('DOMContentLoaded', () => {
    
    // Aquí está tu lista completa con todos los tours y paquetes unidos.
    const allDestinationsData = [
        // === Ica y Huacachina ===
        {
            name: 'Dune Buggy & Sandboard',
            category: 'Ica y Huacachina',
            url: '/tour/Coas of Peru/Ica y Huacachina/tourDuneBuggySandboardFalta.html',
            image: '/assets/img/Costa/Ica_Huaca/Buggy Tour y Sandboard/tourBuggy.jpg'
        },
        {
            name: 'Tour de Viñedo, Museo y Oasis',
            category: 'Ica y Huacachina',
            url: '/tour/Coas of Peru/Ica y Huacachina/tourVineyardMuseumOasisTour.html',
            image: '/assets/img/Costa/Ica_Huaca/Viñedo Museo y Oasis/tourViñedo.jpg'

        },

        // === Lima ===
        {
            name: 'Tour a Caral',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourCaral.html',
            image: '/assets/img/Costa/tours_Lima/Caral/tourCaral.jpg'       
        },
        {
            name: 'Sobrevuelo a las Líneas de Nazca desde Paracas',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourFlightsOverNazca LinesFromLima(1-dayVipPrivate).html',
            image: '/assets/img/Costa/tours_Lima/Sobrevuele las líneas de Nazca desde Pisco (1-día Servicio Privado)/sobrevueloLineasNazca.jpg'
        },
        {
            name: 'City Tour en Lima',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourLimaCityTour.html',
            image: '/assets/img/Costa/tours_Lima/Tour de Lima/tourLima.jpg'
        },
        {
            name: 'Tour de Museos de Lima',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourMuseumsOfLima.html',
            image: '/assets/img/Costa/tours_Lima/Museos de Lima/tourMuseoLima.jpg'
        },
        {
            name: 'Tour de Vida Nocturna en Lima',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourNightlifeInLima.html',
            image: '/assets/img/Costa/tours_Lima/Nocturna/tourNocturno.jpg'
        },
        {
            name: 'Tour a Pachacamac',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourPachacamac.html',
            image: '/assets/img/Costa/tours_Lima/Pachacamac/tourPachacamac.jpg'
        },
        {
            name: 'Tour Museo del Oro del Perú',
            category: 'Lima',
            url: '/tour/Coas of Peru/Lima/tourPeruGold.html',
            image: '/assets/img/Costa/tours_Lima/Oro de Perú/tourMuseooro.jpg'
        },

        // === Líneas de Nazca ===
        {
            name: 'Tour a los Acueductos de Cantalloc',
            category: 'Líneas de Nazca',
            url: '/tour/Coas of Peru/Nazca Lines/tourCantallocAqueducts.html',
            image: '/assets/img/Costa/Lineas de Nazca/Acueductos de Cantalloc/tourCantalloc.jpg'
        },
        {
            name: 'Tour al Cementerio de Chauchilla',
            category: 'Líneas de Nazca',
            url: '/tour/Coas of Peru/Nazca Lines/tourChauchillaCemetery.html',
            image: '/assets/img/Costa/Lineas de Nazca/Cemetario Chaucilla/tourChaucilla.jpg'
        },
        {
            name: 'Tour Clásico a las Líneas de Nazca',
            category: 'Líneas de Nazca',
            url: '/tour/Coas of Peru/Nazca Lines/tourNazcaLines.html',
            image: '/assets/img/Costa/Lineas de Nazca/Lineas de Nazca/tourLineas_Nazca.jpg'
        },
        {
            name: 'Sobrevuelo a las Líneas de Nazca desde Paracas',
            category: 'Líneas de Nazca',
            url: '/tour/Coas of Peru/Nazca Lines/tourNazcaLinesFromParacasPre2nights.html',
            image: '/assets/img/Costa/Lineas de Nazca/Líneas de Nazca desde Paracas/tourlineasNascaParacas.jpg'
        },
        {
            name: 'Tour a la Reserva de Pampas Galeras',
            category: 'Líneas de Nazca',
            url: '/tour/Coas of Peru/Nazca Lines/tourPampasGalerasReserve.html',
            image: '/assets/img/Costa/Lineas de Nazca/Reserva de Pampas Galeras/tourPampaGaleras.jpg'
        },
        {
            name: 'Sobrevuelo a las Líneas de Nazca desde Pisco',
            category: 'Líneas de Nazca',
            url: '/tour/Coas of Peru/Nazca Lines/tourFlightsOverNazca LinesFromLima.html',
            image: '/assets/img/Costa/Lineas de Nazca/Sobrevuele las líneas de Nazca desde Pisco (1-día Servicio Privado)/tourlineasNascaParacas.jpg'
        },

        // === Costa Norte ===
        {
            name: 'Tour a Chan Chan',
            category: 'Costa Norte',
            url: '/tour/Coas of Peru/North Coast/tourChanChan.html',
            image: '/assets/img/Costa/Costa_Norte/ChanChan/tour_Chanchan.jpg'
        },
        {
            name: 'Tour a la Huaca de la Luna',
            category: 'Costa Norte',
            url: '/tour/Coas of Peru/North Coast/tourTempleOfTheMoon.html',
            image: '/assets/img/Costa/Costa_Norte/Huaca de la Luna/tourhuacaLuna.jpg'
        },
        {
            name: 'Tour a los Manglares de Tumbes',
            category: 'Costa Norte',
            url: '/tour/Coas of Peru/North Coast/tourMangrovesOfTumbes.html',
            image: '/assets/img/Costa/Costa_Norte/Manglares de Tumbes/tourManglare_tumbes.jpg'
        },
        {
            name: 'Snorkel con Tortugas',
            category: 'Costa Norte',
            url: '/tour/Coas of Peru/North Coast/tourSnorkelWithTurtles.html',
            image: '/assets/img/Costa/Costa_Norte/Snorkel con las tortugas!/tourSnorke.jpg'
        },

        // === Paracas y Islas Ballestas ===
        {
            name: 'Paseo en Bicicleta por la Reserva de Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourBikingParacas.html',
            image: '/assets/img/Costa/tours_Paracas/La Reserva de Paracas en Bici/tourenBicicleta.jpg'
        },
        {
            name: 'Tour Islas Ballestas para Cruceros (Primera Clase)',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourCruiseMemberIslasBallestasFirtsClass.html',
            image: '/assets/img/Costa/tours_Paracas/Tour primera clase Islas ballestas para miembros de cruceros/cruceroPrimeraClases.jpg'
        },
        {
            name: 'Tour Islas Ballestas para Cruceros (Estándar)',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourCruiseMemberIslasBallestasStandardTour.html',
            image: '/assets/img/Costa/tours_Paracas/Tour Islas ballestas para miembros de cruceros standard tour/CruceroIslasBallestas.jpg'
        },
        {
            name: 'Excursiones en Tierra para Cruceros',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourCruiseShoreExcursions.html',
            image: '/assets/img/Costa/tours_Paracas/Excursiones de Crucero/excursionesCrucero.jpg'
        },
        {
            name: 'Tour en Buggy y Sandboard',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourDuneBuggySandboard.html',
            image: '/assets/img/Costa/tours_Paracas/Tubular Arenero y Sandboard/tubularesArenero.jpg'
        },
        {
            name: 'Tour a las Islas Ballestas',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourIslasBallestas.html',
            image: '/assets/img/Costa/tours_Paracas/Islas Ballestas/tourIslasBallestas.jpg'
        },
        {
            name: 'Tour a las Islas Ballestas (Primera Clase)',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourIslasBallestasFirstClass.html',
            image: '/assets/img/Costa/tours_Paracas/Islas Ballestas First Class/tourIslasBallestasFirst.jpg'
        },
        {
            name: 'Tour a la Reserva Nacional de Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourParacasNationalReserve.html',
            image: '/assets/img/Costa/tours_Paracas/La Reserva Nacional de Paracas/tourReservaParacas.jpg'
        },
        {
            name: 'Tour Privado en Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourPrivateTour.html',
            image: '/assets/img/Costa/tours_Paracas/Tour Privado/tourPrivado.jpg'
        },
        {
            name: 'Alquiler de Yate en Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '/tour/Coas of Peru/Paracas y Islas Ballestas/tourYachtCharter.html',
            image: '/assets/img/Costa/tours_Paracas/Charter de Yate/AlquilerYate.jpg'
        },

        // === Manu Reserve ===
        {
            name: 'Manu Reserve Tour',
            category: 'Manu Reserve',
            url: '/tour/Rainforest/Manu Reserve/tourManuReserve.html',
            image: '/assets/img/Selva_Tropical/Tambopata/Manu Reserve/ReservaManu.jpg'
        },
        {
            name: 'Tambopata Reserve Tour (desde Manu)', 
            category: 'Manu Reserve',
            url: '/tour/Rainforest/Manu Reserve/tourTambopataReserve.html',
            image: '/assets/img/Selva_Tropical/Tambopata/Tambopata/Tambopata.jpg'
        },

        // === Tambopata Rainforest ===
        {
            name: 'Manu Reserve Tour (desde Tambopata)',
            category: 'Tambopata Rainforest',
            url: '/tour/Rainforest/Tambopata Rainforest/tourManuReserve.html',
            image: '/assets/img/Selva_Tropical/Tambopata/Manu Reserve/ReservaManu.jpg'
        },
        {
            name: 'Tambopata Reserve Tour',
            category: 'Tambopata Rainforest',
            url: '/tour/Rainforest/Tambopata Rainforest/tourTambopataReserve.html',
            image: '/assets/img/Selva_Tropical/Tambopata/Tambopata/Tambopata.jpg'
        },

        // === Arequipa (The Highlands) ===
        {
            name: 'Arequipa City Tour',
            category: 'Arequipa',
            url: '/tour/The Highlands/Arequipa/tourArequipaCity.html',
            image: '/assets/img/Sierra/Arequipa/tour Arequipa/tourArequipa.jpg'
        },
        {
            name: 'Colca Canyon Tour',
            category: 'Arequipa',
            url: '/tour/The Highlands/Arequipa/tourColcaCanyon.html',
            image: '/assets/img/Sierra/Arequipa/Tour Cañon del Colca/CañonColaca.jpg'
        },

        // === Cuzco (The Highlands) ===
        {
            name: 'City Tour en Cuzco',
            category: 'Cuzco',
            url: '/tour/The Highlands/Cuzco/tourCuzcoCity.html',
            image: '/assets/img/Sierra/Cuzco/Tour de Cuzco/TourCityCuzco.jpg'
        },
        {
            name: 'Inca Bike & Jungle Trek',
            category: 'Cuzco',
            url: '/tour/The Highlands/Cuzco/tourIncaBike&JungleTrek.html',
            image: '/assets/img/Sierra/Cuzco/Inca Bike & Jungle Trek/InkaBike.jpg'
        },
        {
            name: 'Camino Inca Clásico',
            category: 'Cuzco',
            url: '/tour/The Highlands/Cuzco/tourIncaTrailClassicTrek.html',
            image: '/assets/img/Sierra/Cuzco/Clásico trek en Camino Inca/CaminoInka.jpg'
        },
        {
            name: 'Camino Inca: Salkantay Trek',
            category: 'Cuzco',
            url: '/tour/The Highlands/Cuzco/tourIncaTrailSalkantayTrek.html',
            image: '/assets/img/Sierra/Cuzco/Inca Trail Salkantay Trek/InkaTrailSalkantay.jpg'
        },
        {
            name: 'Tour a Machu Picchu en un Día',
            category: 'Cuzco',
            url: '/tour/The Highlands/Cuzco/tourMachuPicchuDayTrip.html',
            image: '/assets/img/Sierra/Cuzco/Machu Picchu en Un Día/MachuPicchu1Dias.jpg'
        },
        {
            name: 'Canotaje (Rafting)',
            category: 'Cuzco',
            url: '/tour/The Highlands/Cuzco/tourWhiteWaterRafting.html',
            image: '/assets/img/Sierra/Cuzco/Canotaje/CanotajeCuzco.jpg'
        },

        // === Lake Titicaca (The Highlands) ===
        {
            name: 'Lake Titicaca Boat Tour',
            category: 'Lake Titicaca',
            url: '/tour/The Highlands/Lake Titicaca/tourLakeTiticacaBoat.html',
            image: '/assets/img/Sierra/Lago_Titi/Lago Titicaca en Lancha/LagoTitikaka.jpg'
        },
        
        // === Shore Excursions (Callao) ===
        {
            name: 'Shore Excursions to Larco Museum',
            category: 'Cruceros desde Callao',
            url: '/ShoreExcursions/FromCallaoCruiseTerminal/tourShoreExcursionsLarcoMuseum.html',
            image: '/assets/img/Excursiones/Terminal_Callao/Excursiones en tierra a Museo Larco/museoLarco.jpg'
        },
        {
            name: 'Shore Excursions to Pachacamac',
            category: 'Cruceros desde Callao',
            url: '/ShoreExcursions/FromCallaoCruiseTerminal/tourShoreExcursionstoPachacamacArchaeological.html',
            image: '/assets/img/Excursiones/Terminal_Callao/Excursiones en tierra a Sitios arqueológicos de Pachacamac/Lima.jpg'
        },

        // === Shore Excursions (Salaverry) ===
        {
            name: 'Shore Excursions to Chan Chan',
            category: 'Cruceros desde Salaverry',
            url: '/ShoreExcursions/FromSalaverryCruiseTerminal/tourShoreExcursionsChanChan.html',
            image: '/assets/img/Excursiones/Terminal_Salaverry/Excursiones en tierra a Chan Chan/ExcursionesChanChan.jpg'
        },

        // === Shore Excursions (Pisco/Paracas) ===
        {
            name: 'Nazca Lines Flight',
            category: 'Cruceros desde Pisco/Paracas',
            url: '/ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourNazcaLinesFlight.html',
            image: '/assets/img/Excursiones/Terminal_Paracas/Vuelo a las Líneas de Nazca/ExcursionesLineasN.jpg'
        },
        {
            name: 'Shore Excursions to Islas Ballestas',
            category: 'Cruceros desde Pisco/Paracas',
            url: '/ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourShoreExcursionsIslasBallestas.html',
            image: '/assets/img/Excursiones/Terminal_Paracas/Excursiones en tierra a Islas Ballestas/ExcursionesIslasBallestas.jpg'
        },
        {
            name: 'Shore Excursions to Tambo Colorado',
            category: 'Cruceros desde Pisco/Paracas',
            url: '/ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourShoreExcursionsTamboColorado.html',
            image: '/assets/img/Excursiones/Terminal_Paracas/Excursiones en tierra a Tambo Colorado/ExcursionesTamboColorado.jpg'
        },

       // === Peru Packages (¡Añadidos aquí!) ===
        {
            name: 'Machu Picchu & The Sacred Valley of Incas',
            category: 'Peru Packages',
            url: '/PeruPackages/MachuPicchuYTheSecretValleyofIncas/tourMachuPicchu&ValleyIncas.html',
            image: '/assets/img/Paquetes_Peru/Machu_Picchu_Valle/MACHU PICCHU & VALLE SECRETO DE LOS INCAS tour de 7 días/MachuPicchuValle.jpg'
        },

        // MysetrioesOfTheSouthCoast(2Days/1 night) ===
        {
            name: 'Mysteries of The South Coast (2 Days / 1 Night)',
            category: 'MysetrioesOfTheSouthCoast',
            url: '/PeruPackages/MysetrioesOfTheSouthCoast/tourNazcaLinesFlightSouthCoast.html',
            image: '/assets/img/Paquetes_Peru/Misterios_Costa/Misterios de la Costa Sur/paqueteMisteriosSur.jpg'
        },
        {
            name: 'VIP Upgrade for South Coast Tour',
            category: 'MysetrioesOfTheSouthCoast',
            url: '/PeruPackages/MysetrioesOfTheSouthCoast/tourUpgradeToVip.html',
            image: '/assets/img/Paquetes_Peru/Misterios_Costa/Servicio Mejorado VIP/VipMisterios.jpg'
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