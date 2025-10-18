document.addEventListener('DOMContentLoaded', () => {
    
    // Aquí está tu lista completa con todos los tours y paquetes unidos.
    const allDestinationsData = [
        // === Ica y Huacachina ===
        {
            name: 'Dune Buggy & Sandboard',
            category: 'Ica y Huacachina',
            url: 'tour/Coast-of-Peru/Ica-y-Huacachina/tourDuneBuggySandboardFalta.html',
            image: 'assets/img/Costa/Ica_Huaca/Buggy_TourySandboard/tourBuggy.jpg',
        },
        {
            name: 'Tour de Viñedo, Museo y Oasis',
            category: 'Ica y Huacachina',
            url: '../tour/Coast-of-Peru/Ica-y-Huacachina/tourVineyardMuseumOasisTour.html',
            image: '../assets/img/Costa/Ica_Huaca/Viñedo_MuseoOasis/tourViñedo.jpg'
        },

        // === Lima ===
        {
        name: 'Tour a Caral',
        category: 'Lima',
        url: '../tour/Coast-of-Peru/Lima/tourCaral.html',
        image: '../assets/img/Costa/tours_Lima/Caral/tourCaral.jpg'
        },
        {
            name: 'Sobrevuelo a las Líneas de Nazca desde Paracas',
            category: 'Lima',
            url: '../tour/Coast-of-Peru/Lima/tourFlightsOverNazcaLinesFromLima(1-dayVipPrivate).html',
            image: '../assets/img/Costa/tours_Lima/Sobrevuele_las_líneas_de_Nazca_desde_Pisco_1-díaServicio-Privado/sobrevueloLineasNazca.jpg'
        },
        {
            name: 'City Tour en Lima',
            category: 'Lima',
            url: '../tour/Coast-of-Peru/Lima/tourLimaCityTour.html',
            image: '../assets/img/Costa/tours_Lima/Tour_de_Lima/tourLima.jpg'
        },
        {
            name: 'Tour de Museos de Lima',
            category: 'Lima',
            url: '../tour/Coast-of-Peru/Lima/tourMuseumsOfLima.html',
            image: '../assets/img/Costa/tours_Lima/MuseosdeLima/tourMuseoLima.jpg'
        },
        {
            name: 'Tour de Vida Nocturna en Lima',
            category: 'Lima',
            url: '../tour/Coast-of-Peru/Lima/tourNightlifeInLima.html',
            image: '../assets/img/Costa/tours_Lima/Nocturna/tourNocturno.jpg'
        },
        {
            name: 'Tour a Pachacamac',
            category: 'Lima',
            url: '../tour/Coast-of-Peru/Lima/tourPachacamac.html',
            image: '../assets/img/Costa/tours_Lima/Pachacamac/tourPachacamac.jpg'
        },
        {
            name: 'Tour Museo del Oro del Perú',
            category: 'Lima',
            url: '../tour/Coast-of-Peru/Lima/tourPeruGold.html',
            image: '../assets/img/Costa/tours_Lima/Oro_de_Perú/tourMuseooro.jpg'
        },

        // === Líneas de Nazca ===
        {
        name: 'Tour a los Acueductos de Cantalloc',
        category: 'Líneas de Nazca',
        url: '../tour/Coast-of-Peru/Nazca-Lines/tourCantallocAqueducts.html',
        image: '../assets/img/Costa/LineasNazca/Acueductos_de_Cantalloc/tourCantalloc.jpg'
        },
        {
            name: 'Tour al Cementerio de Chauchilla',
            category: 'Líneas de Nazca',
            url: '../tour/Coast-of-Peru/Nazca-Lines/tourChauchillaCemetery.html',
            image: '../assets/img/Costa/LineasNazca/Cemetario_Chaucilla/tourChaucilla.jpg'
        },
        {
            name: 'Tour Clásico a las Líneas de Nazca',
            category: 'Líneas de Nazca',
            url: '../tour/Coast-of-Peru/Nazca-Lines/tourNazcaLines.html',
            image: '../assets/img/Costa/LineasNazca/Lineas_de_Nazca/tourLineas_Nazca.jpg'
        },
        {
            name: 'Sobrevuelo a las Líneas de Nazca desde Paracas',
            category: 'Líneas de Nazca',
            url: '../tour/Coast-of-Peru/Nazca-Lines/tourNazcaLinesFromParacasPre2no.html',
            image: '../assets/img/Costa/LineasNazca/Líneas_de_Nazca_desde_Paracas/tourlineasNascaParacas.jpg'
        },
        {
            name: 'Tour a la Reserva de Pampas Galeras',
            category: 'Líneas de Nazca',
            url: '../tour/Coast-of-Peru/Nazca-Lines/tourPampasGalerasReserve.html',
            image: '../assets/img/Costa/LineasNazca/ReservaPampasGaleras/tourPampaGaleras.jpg'
        },
        {
            name: 'Sobrevuelo a las Líneas de Nazca desde Pisco',
            category: 'Líneas de Nazca',
            url: '../tour/Coast-of-Peru/Nazca-Lines/tourFlightsOverNazca LinesFromLima(1-dayVipPrivate).html',
            image: '../assets/img/Costa/LineasNazca/Sobrevuele_desde_Pisco_1-díaServicio-Privado/tourlineasNascaParacas.jpg'
        },

        // === Costa Norte ===
        {
        name: 'Tour a Chan Chan',
        category: 'Costa Norte',
        url: '../tour/Coast-of-Peru/North-Coast/tourChanChan.html',
        image: '../assets/img/Costa/Costa_Norte/ChanChan/tour_Chanchan.jpg'
        },
        {
            name: 'Tour a la Huaca de la Luna',
            category: 'Costa Norte',
            url: '../tour/Coast-of-Peru/North-Coast/tourTempleOfTheMoon.html',
            image: '../assets/img/Costa/Costa_Norte/Huaca_de_la_Luna/tourhuacaLuna.jpg'
        },
        {
            name: 'Tour a los Manglares de Tumbes',
            category: 'Costa Norte',
            url: '../tour/Coast-of-Peru/North-Coast/tourMangrovesOfTumbes.html',
            image: '../assets/img/Costa/Costa_Norte/Manglares_de_Tumbes/tourManglare_tumbes.jpg'
        },
        {
            name: 'Snorkel con Tortugas',
            category: 'Costa Norte',
            url: '../tour/Coast-of-Peru/North-Coast/tourSnorkelWithTurtles.html',
            image: '../assets/img/Costa/Costa_Norte/Snorkel_con_las_tortugas/tourSnorke.jpg'
        },

        // === Paracas y Islas Ballestas ===
        {
        name: 'Paseo en Bicicleta por la Reserva de Paracas',
        category: 'Paracas y Islas Ballestas',
        url: '../tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourBikingParacas.html',
        image: '../assets/img/Costa/tours_Paracas/LaReservaParacasBici/tourenBicicleta.jpg'
        },
        {
            name: 'Tour Islas Ballestas para Cruceros (Primera Clase)',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourCruiseMemberIslasBallestasFirtsClass.html',
            image: '../assets/img/Costa/tours_Paracas/Tour_primera_Islas_ballestas_miembros_cruceros/cruceroPrimeraClases.jpg'
        },
        {
            name: 'Tour Islas Ballestas para Cruceros (Estándar)',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourCruiseMemberIslasBallestasStandardTour.html',
            image: '../assets/img/Costa/tours_Paracas/Tour_Islas_ballestas_miembros_ruceros_standard_tours/CruceroIslasBallestas.jpg'
        },
        {
            name: 'Excursiones en Tierra para Cruceros',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourCruiseShoreEscursions.html',
            image: '../assets/img/Costa/tours_Paracas/ExcursionesCrucero/excursionesCrucero.jpg'
        },
        {
            name: 'Tour en Buggy y Sandboard',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourDuneBuggySandboard.html',
            image: '../assets/img/Costa/tours_Paracas/Tubular_Arenero_Sandboard/tubularesArenero.jpg'
        },
        {
            name: 'Tour a las Islas Ballestas',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourIslasBallestas.html',
            image: '../assets/img/Costa/tours_Paracas/IslasBallestas/tourIslasBallestas.jpg'
        },
        {
            name: 'Tour a las Islas Ballestas (Primera Clase)',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourIslasBallestasFirstClass.html',
            image: '../assets/img/Costa/tours_Paracas/IslasBallestasFirstClass/tourIslasBallestasFirst.jpg'
        },
        {
            name: 'Tour a la Reserva Nacional de Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourParacasNationalReserve.html',
            image: '../assets/img/Costa/tours_Paracas/La_Reserva_Nacional_Paracas/tourReservaParacas.jpg'
        },
        {
            name: 'Tour Privado en Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourPrivateTour.html',
            image: '../assets/img/Costa/tours_Paracas/Tour_Privado/TourPrivado.jpg'
        },
        {
            name: 'Alquiler de Yate en Paracas',
            category: 'Paracas y Islas Ballestas',
            url: '../tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourYachtCharter.html',
            image: '../assets/img/Costa/tours_Paracas/CharterYate/AlquilerYate.jpg'
        },

        // === Manu Reserve ===
        {
            name: 'Manu Reserve Tour',
            category: 'Manu Reserve',
            url: '../tour/Rainforest/Manu-Reserve/tourManuReserve.html',
            image: '../assets/img/Selva_Tropical/Parque_Manu/ReservaManu.jpg'
        },

        // === Tambopata Rainforest ===
        {
            name: 'Manu Reserve Tour (desde Tambopata)',
            category: 'Tambopata Rainforest',
            url: '../tour/Rainforest/Tambopata-Rainforest/tourManuReserve.html',
            image: '../assets/img/Selva_Tropical/Tambopata/ManuReserve/ReservaManu.jpg'
        },
        {
            name: 'Tambopata Reserve Tour',
            category: 'Tambopata Rainforest',
            url: '../tour/Rainforest/Tambopata-Rainforest/tourTambopataReserve.html',
            image: '../assets/img/Selva_Tropical/Tambopata/Tambopata/Tambopata.jpg'
        },

        // === Arequipa (The Highlands) ===
        {
            name: 'Arequipa City Tour',
            category: 'Arequipa',
            url: '../tour/The-Highlands/Arequipa/tourArequipaCity.html',
            image: '../assets/img/SIerra/Arequipa/tour_Arequipa/tourArequipa.jpg'
        },
        {
            name: 'Colca Canyon Tour',
            category: 'Arequipa',
            url: '../tour/The-Highlands/Arequipa/tourColcaCanyon.html',
            image: '../assets/img/SIerra/Arequipa/Tour_CañonColca/CañonColaca.jpg'
        },

        // === Cuzco (The Highlands) ===
        {
            name: 'City Tour en Cuzco',
            category: 'Cuzco',
            url: '../tour/The-Highlands/Cuzco/tourCuzcoCity.html',
            image: '../assets/img/SIerra/Cuzco/Tour-de-Cuzco/TourCityCuzco.jpg'
        },
        {
            name: 'Inca Bike & Jungle Trek',
            category: 'Cuzco',
            url: '../tour/The Highlands/Cuzco/tourIncaBike&JungleTrek.html',
            image: '../assets/img/SIerra/Cuzco/IncaBikeJungleTrek/InkaBike.jpg'
        },
        {
            name: 'Camino Inca Clásico',
            category: 'Cuzco',
            url: '../tour/The Highlands/Cuzco/tourIncaTrailClassicTrek.html',
            image: '../assets/img/SIerra/Cuzco/Clásico_trekenCamino_Inca/CaminoInka.jpg'
        },
        {
            name: 'Camino Inca: Salkantay Trek',
            category: 'Cuzco',
            url: '../tour/The Highlands/Cuzco/tourIncaTrailSalkantayTrek.html',
            image: '../assets/img/SIerra/Cuzco/IncaTrailSalkantayTrek/InkaTrailSalkantay.jpg'
        },
        {
            name: 'Tour a Machu Picchu en un Día',
            category: 'Cuzco',
            url: '../tour/The Highlands/Cuzco/tourMachuPicchuDayTrip.html',
            image: '../assets/img/SIerra/Cuzco/Machu-Picchu-en-Un-Día/MachuPicchu1Dias.jpg'
        },
        {
            name: 'Canotaje (Rafting)',
            category: 'Cuzco',
            url: '../tour/The-Highlands/Cuzco/tourWhiteWaterRafting.html',
            image: '../assets/img/SIerra/Cuzco/Canotaje/CanotajeCuzco.jpg'
        },

        // === Lake Titicaca (The Highlands) ===
        {
            name: 'Lake Titicaca Boat Tour',
            category: 'Lake Titicaca',
            url: '../tour/The-Highlands/Lake-Titicaca/tourLakeTiticacaBoat.html',
            image: '../assets/img/SIerra/Lago_Titi/Lago-Titicaca-en-Lancha/LagoTitikaka.jpg'
        },
        
        // === Shore Excursions (Callao) ===
        {
            name: 'Shore Excursions to Larco Museum',
            category: 'Cruceros desde Callao',
            url: '../ShoreExcursions/FromCallaoCruiseTerminal/tourShoreExcursionsLarcoMuseum.html',
            image: '../assets/img/Excursiones/Terminal_Callao/Excursiones_tierra_MuseoLarco/museoLarco.jpg'
        },
        {
            name: 'Shore Excursions to Pachacamac',
            category: 'Cruceros desde Callao',
            url: '../ShoreExcursions/FromCallaoCruiseTerminal/tourShoreExcursionstoPachacamacArchaeological.html',
            image: '../assets/img/Excursiones/Terminal_Callao/Excursiones_tierra_Sitios_arqueológicos_Pachacamac/Lima.jpg'
        },

        // === Shore Excursions (Salaverry) ===
        {
            name: 'Shore Excursions to Chan Chan',
            category: 'Cruceros desde Salaverry',
            url: '../ShoreExcursions/FromSalaverryCruiseTerminal/tourShoreExcursionsChanChan.html',
            image: '../assets/img/Excursiones/Terminal_Salaverry/Excursiones_tierra_ChanChan/ExcursionesChanChan.jpg'
        },

        // === Shore Excursions (Pisco/Paracas) ===
        {
            name: 'Nazca Lines Flight',
            category: 'Cruceros desde Pisco/Paracas',
            url: '../ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourNazcaLinesFlight.html',
            image: '../assets/img/Excursiones/Terminal_Paracas/Vuelo_las_Líneas_Nazca/ExcursionesLineasN.jpg'
        },
        {
            name: 'Shore Excursions to Islas Ballestas',
            category: 'Cruceros desde Pisco/Paracas',
            url: '../FromTPPPiscoParacasCruiseTerminal/tourShoreExcursionsIslasBallestas.html',
            image: '../assets/img/Excursiones/Terminal_Paracas/Excursiones_tierra_IslasBallestas/ExcursionesIslasBallestas.jpg'
        },
        {
            name: 'Shore Excursions to Tambo Colorado',
            category: 'Cruceros desde Pisco/Paracas',
            url: '../ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourShoreExcursionsTamboColorado.html',
            image: '../assets/img/Excursiones/Terminal_Paracas/Excursiones_tierra_TamboColorado/ExcursionesTamboColorado.jpg'
        },

       // === Peru Packages (¡Añadidos aquí!) ===
        {
            name: 'Machu Picchu & The Sacred Valley of Incas',
            category: 'Peru Packages',
            url: '../PeruPackages/MachuPicchuYTheSecretValleyofIncas/tourMachuPicchu&ValleyIncas.html',
            image: '../assets/img/Paquetes_Peru/Machu_Picchu_Valle/MACHUPICCHU_VALLE_SECRETO_LOS_INCAS_7_días/MachuPicchuValle.jpg'
        },

        // MysetrioesOfTheSouthCoast(2Days/1 night) ===
        {
            name: 'Mysteries of The South Coast (2 Days / 1 Night)',
            category: 'MysetrioesOfTheSouthCoast',
            url: '../PeruPackages/MysetrioesOfTheSouthCoast/tourNazcaLinesFlightSouthCoast.html',
            image: '../assets/img/Paquetes_Peru/Misterios_Costa/Misterios_Costa_Sur/paqueteMisteriosSur.jpg'
        },
        {
            name: 'VIP Upgrade for South Coast Tour',
            category: 'MysetrioesOfTheSouthCoast',
            url: '../PeruPackages/MysetrioesOfTheSouthCoast/tourUpgradeToVip.html',
            image: '../assets/img/Paquetes_Peru/Misterios_Costa/Servicio_Mejorado_VIP/VipMisterios.jpg'
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