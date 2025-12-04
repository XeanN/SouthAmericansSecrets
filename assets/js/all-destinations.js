document.addEventListener('DOMContentLoaded', () => {

    // 1. DETECCIÓN DE IDIOMA
    const isSpanish = window.location.pathname.includes("/es/");

    // 2. DATA EN INGLÉS (ORIGINAL)
    const allDestinationsDataEn = [
        
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
            url: 'tour/Coast-of-Peru/Ica-y-Huacachina/tourVineyardMuseumOasisTour.html',
            image: 'assets/img/Costa/Ica_Huaca/Viñedo_MuseoOasis/tourViñedo.jpg'
        },

        // === Lima ===
        {
        name: 'Tour to Caral',
        category: 'Lima',
        url: 'tour/Coast-of-Peru/Lima/tourCaral.html',
        image: 'assets/img/Costa/tours_Lima/Caral/tourCaral.jpg'
        },
        {
            name: 'Nazca Lines Overflight from Paracas',
            category: 'Lima',
            url: 'tour/Coast-of-Peru/Lima/tourFlightsOverNazcaLinesFromLima1-dayVipPrivate.html',
            image: 'assets/img/Costa/tours_Lima/Sobrevuele_las_líneas_de_Nazca_desde_Pisco_1-díaServicio-Privado/sobrevueloLineasNazca.jpg'
        },
        {
            name: 'Lima City Tour',
            category: 'Lima',
            url: 'tour/Coast-of-Peru/Lima/tourLimaCityTour.html',
            image: 'assets/img/Costa/tours_Lima/Tour_de_Lima/tourLima.jpg'
        },
        {
            name: 'Lima Museums Tour',
            category: 'Lima',
            url: 'tour/Coast-of-Peru/Lima/tourMuseumsOfLima.html',
            image: 'assets/img/Costa/tours_Lima/MuseosdeLima/tourMuseoLima.jpg'
        },
        {
            name: 'Lima Nightlife Tour',
            category: 'Lima',
            url: 'tour/Coast-of-Peru/Lima/tourNightlifeInLima.html',
            image: 'assets/img/Costa/tours_Lima/Nocturna/tourNocturno.jpg'
        },
        {
            name: 'Pachacamac Tour',
            category: 'Lima',
            url: 'tour/Coast-of-Peru/Lima/tourPachacamac.html',
            image: 'assets/img/Costa/tours_Lima/Pachacamac/tourPachacamac.jpg'
        },
        {
            name: 'Perú Gold Museum Tour',
            category: 'Lima',
            url: 'tour/Coast-of-Peru/Lima/tourPeruGold.html',
            image: 'assets/img/Costa/tours_Lima/Oro_de_Perú/tourMuseooro.jpg'
        },

        // === Líneas de Nazca ===
        {
        name: 'Cantalloc Aqueducts Tour',
        category: 'Líneas de Nazca',
        url: 'tour/Coast-of-Peru/Nazca-Lines/tourCantallocAqueducts.html',
        image: 'assets/img/Costa/LineasNazca/Acueductos_de_Cantalloc/tourCantalloc.jpg'
        },
        {
            name: 'Chauchilla Cemetery Tour',
            category: 'Líneas de Nazca',
            url: 'tour/Coast-of-Peru/Nazca-Lines/tourChauchillaCemetery.html',
            image: 'assets/img/Costa/LineasNazca/Cemetario_Chaucilla/tourChaucilla.jpg'
        },
        {
            name: 'Classic Nazca Lines Overflight',
            category: 'Líneas de Nazca',
            url: 'tour/Coast-of-Peru/Nazca-Lines/tourNazcaLines.html',
            image: 'assets/img/Costa/LineasNazca/Lineas_de_Nazca/tourLineas_Nazca.jpg'
        },
        {
            name: 'Nazca Lines Overflight from Paracas',
            category: 'Líneas de Nazca',
            url: 'tour/Coast-of-Peru/Nazca-Lines/tourNazcaLinesFromParacasPre2no.html',
            image: 'assets/img/Costa/LineasNazca/Líneas_de_Nazca_desde_Paracas/tourlineasNascaParacas.jpg'
        },
        {
            name: 'Pampas Galeras Reserve Tour',
            category: 'Líneas de Nazca',
            url: 'tour/Coast-of-Peru/Nazca-Lines/tourPampasGalerasReserve.html',
            image: 'assets/img/Costa/LineasNazca/ReservaPampasGaleras/tourPampaGaleras.jpg'
        },
        {
            name: 'Nazca Lines Overflight from Pisco',
            category: 'Líneas de Nazca',
            url: 'tour/Coast-of-Peru/Nazca-Lines/tourFlightsOverNazca LinesFromLima(1-dayVipPrivate).html',
            image: 'assets/img/Costa/LineasNazca/Sobrevuele_desde_Pisco_1-díaServicio-Privado/tourlineasNascaParacas.jpg'
        },

        // === Costa Norte ===
        {
        name: 'Chan Chan Tour',
        category: 'Costa Norte',
        url: 'tour/Coast-of-Peru/North-Coast/tourChanChan.html',
        image: 'assets/img/Costa/Costa_Norte/ChanChan/tour_Chanchan.jpg'
        },
        {
            name: 'Huaca de la Luna Tour',
            category: 'Costa Norte',
            url: 'tour/Coast-of-Peru/North-Coast/tourTempleOfTheMoon.html',
            image: 'assets/img/Costa/Costa_Norte/Huaca_de_la_Luna/tourhuacaLuna.jpg'
        },
        {
            name: 'Tumbes Mangrove Swamps Tour',
            category: 'Costa Norte',
            url: 'tour/Coast-of-Peru/North-Coast/tourMangrovesOfTumbes.html',
            image: 'assets/img/Costa/Costa_Norte/Manglares_de_Tumbes/tourManglare_tumbes.jpg'
        },
        {
            name: 'Snorkeling with Turtles',
            category: 'Costa Norte',
            url: 'tour/Coast-of-Peru/North-Coast/tourSnorkelWithTurtles.html',
            image: 'assets/img/Costa/Costa_Norte/Snorkel_con_las_tortugas/tourSnorke.jpg'
        },

        // === Paracas y Islas Ballestas ===
        {
        name: 'Paracas Reserve Bike Tour',
        category: 'Paracas y Islas Ballestas',
        url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourBikingParacas.html',
        image: 'assets/img/Costa/tours_Paracas/LaReservaParacasBici/tourenBicicleta.jpg'
        },
        {
            name: 'Ballestas Islands Tour for Cruise Passengers (First Class)',
            category: 'Paracas y Islas Ballestas',
            url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourCruiseMemberIslasBallestasFirtsClass.html',
            image: 'assets/img/Costa/tours_Paracas/Tour_primera_Islas_ballestas_miembros_cruceros/cruceroPrimeraClases.jpg'
        },
        {
            name: 'Ballestas Islands Tour for Cruise Passengers (Standard)',
            category: 'Paracas y Islas Ballestas',
            url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourCruiseMemberIslasBallestasStandardTour.html',
            image: 'assets/img/Costa/tours_Paracas/Tour_Islas_ballestas_miembros_ruceros_standard_tours/CruceroIslasBallestas.jpg'
        },
        {
            name: 'Shore Excursions for Cruises',
            category: 'Paracas y Islas Ballestas',
            url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourCruiseShoreEscursions.html',
            image: 'assets/img/Costa/tours_Paracas/ExcursionesCrucero/excursionesCrucero.jpg'
        },
        {
            name: 'Tour en Buggy y Sandboard',
            category: 'Paracas y Islas Ballestas',
            url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourDuneBuggySandboard.html',
            image: 'assets/img/Costa/tours_Paracas/Tubular_Arenero_Sandboard/tubularesArenero.jpg'
        },
        {
            name: 'Ballestas Islands Tour',
            category: 'Paracas y Islas Ballestas',
            url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourIslasBallestas.html',
            image: 'assets/img/Costa/tours_Paracas/IslasBallestas/tourIslasBallestas.jpg'
        },
        {
            name: 'Ballestas Islands Tour (First Class)',
            category: 'Paracas y Islas Ballestas',
            url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourIslasBallestasFirstClass.html',
            image: 'assets/img/Costa/tours_Paracas/IslasBallestasFirstClass/tourIslasBallestasFirst.jpg'
        },
        {
            name: 'Paracas National Reserve Tour',
            category: 'Paracas y Islas Ballestas',
            url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourParacasNationalReserve.html',
            image: 'assets/img/Costa/tours_Paracas/La_Reserva_Nacional_Paracas/tourReservaParacas.jpg'
        },
        {
            name: 'Private Paracas Tour',
            category: 'Paracas y Islas Ballestas',
            url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourPrivateTour.html',
            image: 'assets/img/Costa/tours_Paracas/Tour_Privado/TourPrivado.jpg'
        },
        {
            name: 'Yacht Rental in Paracas',
            category: 'Paracas y Islas Ballestas',
            url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourYachtCharter.html',
            image: 'assets/img/Costa/tours_Paracas/CharterYate/AlquilerYate.jpg'
        },

        // === Manu Reserve ===
        {
            category: 'Manu Reserve Tour',
            url: 'tour/Rainforest/Manu-Reserve/tourManuReserve.html',
            image: 'assets/img/Selva_Tropical/Parque_Manu/ReservaManu.jpg'
        },

        // === Tambopata Rainforest ===
        {
            name: 'Manu Reserve Tour (from Tambopata)',
            category: 'Tambopata Rainforest',
            url: 'tour/Rainforest/Tambopata-Rainforest/tourManuReserve.html',
            image: 'assets/img/Selva_Tropical/Tambopata/ManuReserve/ReservaManu.jpg'
        },
        {
            name: 'Tambopata Reserve Tour',
            category: 'Tambopata Rainforest',
            url: 'tour/Rainforest/Tambopata-Rainforest/tourTambopataReserve.html',
            image: 'assets/img/Selva_Tropical/Tambopata/Tambopata/Tambopata.jpg'
        },

        // === Arequipa (The Highlands) ===
        {
            name: 'Arequipa City Tour',
            category: 'Arequipa',
            url: 'tour/The-Highlands/Arequipa/tourArequipaCity.html',
            image: 'assets/img/SIerra/Arequipa/tour_Arequipa/tourArequipa.jpg'
        },
        {
            name: 'Colca Canyon Tour',
            category: 'Arequipa',
            url: 'tour/The-Highlands/Arequipa/tourColcaCanyon.html',
            image: 'assets/img/SIerra/Arequipa/Tour_CañonColca/CañonColaca.jpg'
        },

        // === Cuzco (The Highlands) ===
        {
            name: 'Cusco City Tour',
            category: 'Cuzco',
            url: 'tour/The-Highlands/Cuzco/tourCuzcoCity.html',
            image: 'assets/img/SIerra/Cuzco/Tour-de-Cuzco/TourCityCuzco.jpg'
        },
        {
            name: 'Inca Bike & Jungle Trek',
            category: 'Cuzco',
            url: 'tour/The-Highlands/Cuzco/tourIncaBike&JungleTrek.html',
            image: 'assets/img/SIerra/Cuzco/IncaBikeJungleTrek/InkaBike.jpg'
        },
        {
            name: 'Classic Inca Trail',
            category: 'Cuzco',
            url: 'tour/The-Highlands/Cuzco/tourIncaTrailClassicTrek.html',
            image: 'assets/img/SIerra/Cuzco/Clásico_trekenCamino_Inca/CaminoInka.jpg'
        },
        {
            name: 'Inca Trail: Salkantay Trek',
            category: 'Cuzco',
            url: 'tour/The-Highlands/Cuzco/tourIncaTrailSalkantayTrek.html',
            image: 'assets/img/SIerra/Cuzco/IncaTrailSalkantayTrek/InkaTrailSalkantay.jpg'
        },
        {
            name: 'Machu Picchu Full-Day Tour',
            category: 'Cuzco',
            url: 'tour/The-Highlands/Cuzco/tourMachuPicchuDayTrip.html',
            image: 'assets/img/SIerra/Cuzco/Machu-Picchu-en-Un-Día/MachuPicchu1Dias.jpg'
        },
        {
            name: 'Rafting',
            category: 'Cuzco',
            url: 'tour/The-Highlands/Cuzco/tourWhiteWaterRafting.html',
            image: 'assets/img/SIerra/Cuzco/Canotaje/CanotajeCuzco.jpg'
        },

        // === Lake Titicaca (The Highlands) ===
        {
            name: 'Lake Titicaca Boat Tour',
            category: 'Lake Titicaca',
            url: 'tour/The-Highlands/Lake-Titicaca/tourLakeTiticacaBoat.html',
            image: 'assets/img/SIerra/Lago_Titi/Lago-Titicaca-en-Lancha/LagoTitikaka.jpg'
        },
        
        // === Shore Excursions (Callao) ===
        {
            name: 'Shore Excursions to Larco Museum',
            category: 'Cruceros desde Callao',
            url: 'ShoreExcursions/FromCallaoCruiseTerminal/tourShoreExcursionsLarcoMuseum.html',
            image: 'assets/img/Excursiones/Terminal_Callao/Excursiones_tierra_MuseoLarco/museoLarco.jpg'
        },
        {
            name: 'Shore Excursions to Pachacamac',
            category: 'Cruceros desde Callao',
            url: 'ShoreExcursions/FromCallaoCruiseTerminal/tourShoreExcursionstoPachacamacArchaeological.html',
            image: 'assets/img/Excursiones/Terminal_Callao/Excursiones_tierra_Sitios_arqueológicos_Pachacamac/Lima.jpg'
        },

        // === Shore Excursions (Salaverry) ===
        {
            name: 'Shore Excursions to Chan Chan',
            category: 'Cruceros desde Salaverry',
            url: 'ShoreExcursions/FromSalaverryCruiseTerminal/tourShoreExcursionsChanChan.html',
            image: 'assets/img/Excursiones/Terminal_Salaverry/Excursiones_tierra_ChanChan/ExcursionesChanChan.jpg'
        },

        // === Shore Excursions (Pisco/Paracas) ===
        {
            name: 'Nazca Lines Flight',
            category: 'Cruceros desde Pisco/Paracas',
            url: 'ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourNazcaLinesFlight.html',
            image: 'assets/img/Excursiones/Terminal_Paracas/Vuelo_las_Líneas_Nazca/ExcursionesLineasN.jpg'
        },
        {
            name: 'Shore Excursions to Islas Ballestas',
            category: 'Cruceros desde Pisco/Paracas',
            url: 'ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourShoreExcursionsIslasBallestas.html',
            image: 'assets/img/Excursiones/Terminal_Paracas/Excursiones_tierra_IslasBallestas/ExcursionesIslasBallestas.jpg'
        },
        {
            name: 'Shore Excursions to Tambo Colorado',
            category: 'Cruceros desde Pisco/Paracas',
            url: 'ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourShoreExcursionsTamboColorado.html',
            image: 'assets/img/Excursiones/Terminal_Paracas/Excursiones_tierra_TamboColorado/ExcursionesTamboColorado.jpg'
        },

       // === Peru Packages (¡Añadidos aquí!) ===
        {
            name: 'Machu Picchu & The Sacred Valley of Incas',
            category: 'Peru Packages',
            url: 'PeruPackages/MachuPicchuYTheSecretValleyofIncas/tourMachuPicchu&ValleyIncas.html',
            image: 'assets/img/Paquetes_Peru/Machu_Picchu_Valle/MACHUPICCHU_VALLE_SECRETO_LOS_INCAS_7_días/MachuPicchuValle.jpg'
        },
        
        // MysetrioesOfTheSouthCoast(2Days/1 night) ===
        {
            name: 'Mysteries of The South Coast (2 Days / 1 Night)',
            category: 'MysetrioesOfTheSouthCoast',
            url: 'PeruPackages/MysetrioesOfTheSouthCoast/tourNazcaLinesFlightSouthCoast.html',
            image: 'assets/img/Paquetes_Peru/Misterios_Costa/Misterios_Costa_Sur/paqueteMisteriosSur.jpg'
        },
        {
            name: 'VIP Upgrade for South Coast Tour',
            category: 'MysetrioesOfTheSouthCoast',
            url: 'PeruPackages/MysetrioesOfTheSouthCoast/tourUpgradeToVip.html',
            image: 'assets/img/Paquetes_Peru/Misterios_Costa/Servicio_Mejorado_VIP/VipMisterios.jpg'
        }
    ];

    // 3. DATA EN ESPAÑOL (TRADUCIDA)
    // Usamos las mismas categorías para que el filtro funcione igual, pero traducimos los nombres
    // y apuntamos las URLs a la carpeta /es/
    const allDestinationsDataEs = [
        
        // === Ica y Huacachina ===
        {
            name: 'Dune Buggy y Sandboard',
            category: 'Ica y Huacachina',
            url: 'es/tour/Coast-of-Peru/Ica-y-Huacachina/tourDuneBuggySandboardFalta.html',
            image: 'assets/img/Costa/Ica_Huaca/Buggy_TourySandboard/tourBuggy.jpg',
        },
        {
            name: 'Tour de Viñedo, Museo y Oasis',
            category: 'Ica y Huacachina',
            url: 'es/tour/Coast-of-Peru/Ica-y-Huacachina/tourVineyardMuseumOasisTour.html',
            image: 'assets/img/Costa/Ica_Huaca/Viñedo_MuseoOasis/tourViñedo.jpg'
        },

        // === Lima ===
        {
            name: 'Tour a Caral',
            category: 'Lima',
            url: 'es/tour/Coast-of-Peru/Lima/tourCaral.html',
            image: 'assets/img/Costa/tours_Lima/Caral/tourCaral.jpg'
        },
        {
            name: 'Sobrevuelo Líneas de Nazca desde Paracas',
            category: 'Lima',
            url: 'es/tour/Coast-of-Peru/Lima/tourFlightsOverNazcaLinesFromLima1-dayVipPrivate.html',
            image: 'assets/img/Costa/tours_Lima/Sobrevuele_las_líneas_de_Nazca_desde_Pisco_1-díaServicio-Privado/sobrevueloLineasNazca.jpg'
        },
        {
            name: 'Tour Ciudad de Lima',
            category: 'Lima',
            url: 'es/tour/Coast-of-Peru/Lima/tourLimaCityTour.html',
            image: 'assets/img/Costa/tours_Lima/Tour_de_Lima/tourLima.jpg'
        },
        {
            name: 'Tour Museos de Lima',
            category: 'Lima',
            url: 'es/tour/Coast-of-Peru/Lima/tourMuseumsOfLima.html',
            image: 'assets/img/Costa/tours_Lima/MuseosdeLima/tourMuseoLima.jpg'
        },
        {
            name: 'Tour Lima Nocturna',
            category: 'Lima',
            url: 'es/tour/Coast-of-Peru/Lima/tourNightlifeInLima.html',
            image: 'assets/img/Costa/tours_Lima/Nocturna/tourNocturno.jpg'
        },
        {
            name: 'Tour Pachacamac',
            category: 'Lima',
            url: 'es/tour/Coast-of-Peru/Lima/tourPachacamac.html',
            image: 'assets/img/Costa/tours_Lima/Pachacamac/tourPachacamac.jpg'
        },
        {
            name: 'Tour Museo de Oro del Perú',
            category: 'Lima',
            url: 'es/tour/Coast-of-Peru/Lima/tourPeruGold.html',
            image: 'assets/img/Costa/tours_Lima/Oro_de_Perú/tourMuseooro.jpg'
        },

        // === Líneas de Nazca ===
        {
            name: 'Tour Acueductos de Cantalloc',
            category: 'Líneas de Nazca',
            url: 'es/tour/Coast-of-Peru/Nazca-Lines/tourCantallocAqueducts.html',
            image: 'assets/img/Costa/LineasNazca/Acueductos_de_Cantalloc/tourCantalloc.jpg'
        },
        {
            name: 'Tour Cementerio Chauchilla',
            category: 'Líneas de Nazca',
            url: 'es/tour/Coast-of-Peru/Nazca-Lines/tourChauchillaCemetery.html',
            image: 'assets/img/Costa/LineasNazca/Cemetario_Chaucilla/tourChaucilla.jpg'
        },
        {
            name: 'Sobrevuelo Clásico Líneas de Nazca',
            category: 'Líneas de Nazca',
            url: 'es/tour/Coast-of-Peru/Nazca-Lines/tourNazcaLines.html',
            image: 'assets/img/Costa/LineasNazca/Lineas_de_Nazca/tourLineas_Nazca.jpg'
        },
        {
            name: 'Sobrevuelo Líneas de Nazca desde Paracas',
            category: 'Líneas de Nazca',
            url: 'es/tour/Coast-of-Peru/Nazca-Lines/tourNazcaLinesFromParacasPre2no.html',
            image: 'assets/img/Costa/LineasNazca/Líneas_de_Nazca_desde_Paracas/tourlineasNascaParacas.jpg'
        },
        {
            name: 'Tour Reserva Pampas Galeras',
            category: 'Líneas de Nazca',
            url: 'es/tour/Coast-of-Peru/Nazca-Lines/tourPampasGalerasReserve.html',
            image: 'assets/img/Costa/LineasNazca/ReservaPampasGaleras/tourPampaGaleras.jpg'
        },
        {
            name: 'Sobrevuelo Líneas de Nazca desde Pisco',
            category: 'Líneas de Nazca',
            url: 'es/tour/Coast-of-Peru/Nazca-Lines/tourFlightsOverNazca LinesFromLima(1-dayVipPrivate).html',
            image: 'assets/img/Costa/LineasNazca/Sobrevuele_desde_Pisco_1-díaServicio-Privado/tourlineasNascaParacas.jpg'
        },

        // === Costa Norte ===
        {
            name: 'Tour Chan Chan',
            category: 'Costa Norte',
            url: 'es/tour/Coast-of-Peru/North-Coast/tourChanChan.html',
            image: 'assets/img/Costa/Costa_Norte/ChanChan/tour_Chanchan.jpg'
        },
        {
            name: 'Tour Huaca de la Luna',
            category: 'Costa Norte',
            url: 'es/tour/Coast-of-Peru/North-Coast/tourTempleOfTheMoon.html',
            image: 'assets/img/Costa/Costa_Norte/Huaca_de_la_Luna/tourhuacaLuna.jpg'
        },
        {
            name: 'Tour Manglares de Tumbes',
            category: 'Costa Norte',
            url: 'es/tour/Coast-of-Peru/North-Coast/tourMangrovesOfTumbes.html',
            image: 'assets/img/Costa/Costa_Norte/Manglares_de_Tumbes/tourManglare_tumbes.jpg'
        },
        {
            name: 'Snorkel con Tortugas',
            category: 'Costa Norte',
            url: 'es/tour/Coast-of-Peru/North-Coast/tourSnorkelWithTurtles.html',
            image: 'assets/img/Costa/Costa_Norte/Snorkel_con_las_tortugas/tourSnorke.jpg'
        },

        // === Paracas y Islas Ballestas ===
        {
            name: 'Tour Reserva de Paracas en Bicicleta',
            category: 'Paracas y Islas Ballestas',
            url: 'es/tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourBikingParacas.html',
            image: 'assets/img/Costa/tours_Paracas/LaReservaParacasBici/tourenBicicleta.jpg'
        },
        {
            name: 'Tour Islas Ballestas para Pasajeros de Crucero (Primera Clase)',
            category: 'Paracas y Islas Ballestas',
            url: 'es/tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourCruiseMemberIslasBallestasFirtsClass.html',
            image: 'assets/img/Costa/tours_Paracas/Tour_primera_Islas_ballestas_miembros_cruceros/cruceroPrimeraClases.jpg'
        },
        {
            name: 'Tour Islas Ballestas para Pasajeros de Crucero (Estándar)',
            category: 'Paracas y Islas Ballestas',
            url: 'es/tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourCruiseMemberIslasBallestasStandardTour.html',
            image: 'assets/img/Costa/tours_Paracas/Tour_Islas_ballestas_miembros_ruceros_standard_tours/CruceroIslasBallestas.jpg'
        },
        {
            name: 'Excursiones en Tierra para Cruceros',
            category: 'Paracas y Islas Ballestas',
            url: 'es/tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourCruiseShoreEscursions.html',
            image: 'assets/img/Costa/tours_Paracas/ExcursionesCrucero/excursionesCrucero.jpg'
        },
        {
            name: 'Tour en Buggy y Sandboard',
            category: 'Paracas y Islas Ballestas',
            url: 'es/tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourDuneBuggySandboard.html',
            image: 'assets/img/Costa/tours_Paracas/Tubular_Arenero_Sandboard/tubularesArenero.jpg'
        },
        {
            name: 'Tour Islas Ballestas',
            category: 'Paracas y Islas Ballestas',
            url: 'es/tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourIslasBallestas.html',
            image: 'assets/img/Costa/tours_Paracas/IslasBallestas/tourIslasBallestas.jpg'
        },
        {
            name: 'Tour Islas Ballestas (Primera Clase)',
            category: 'Paracas y Islas Ballestas',
            url: 'es/tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourIslasBallestasFirstClass.html',
            image: 'assets/img/Costa/tours_Paracas/IslasBallestasFirstClass/tourIslasBallestasFirst.jpg'
        },
        {
            name: 'Tour Reserva Nacional de Paracas',
            category: 'Paracas y Islas Ballestas',
            url: 'es/tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourParacasNationalReserve.html',
            image: 'assets/img/Costa/tours_Paracas/La_Reserva_Nacional_Paracas/tourReservaParacas.jpg'
        },
        {
            name: 'Tour Privado Paracas',
            category: 'Paracas y Islas Ballestas',
            url: 'es/tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourPrivateTour.html',
            image: 'assets/img/Costa/tours_Paracas/Tour_Privado/TourPrivado.jpg'
        },
        {
            name: 'Alquiler de Yates en Paracas',
            category: 'Paracas y Islas Ballestas',
            url: 'es/tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourYachtCharter.html',
            image: 'assets/img/Costa/tours_Paracas/CharterYate/AlquilerYate.jpg'
        },

        // === Manu Reserve ===
        {
            category: 'Manu Reserve Tour',
            url: 'es/tour/Rainforest/Manu-Reserve/tourManuReserve.html',
            image: 'assets/img/Selva_Tropical/Parque_Manu/ReservaManu.jpg'
        },

        // === Tambopata Rainforest ===
        {
            name: 'Tour Reserva Manu (desde Tambopata)',
            category: 'Tambopata Rainforest',
            url: 'es/tour/Rainforest/Tambopata-Rainforest/tourManuReserve.html',
            image: 'assets/img/Selva_Tropical/Tambopata/ManuReserve/ReservaManu.jpg'
        },
        {
            name: 'Tour Reserva Tambopata',
            category: 'Tambopata Rainforest',
            url: 'es/tour/Rainforest/Tambopata-Rainforest/tourTambopataReserve.html',
            image: 'assets/img/Selva_Tropical/Tambopata/Tambopata/Tambopata.jpg'
        },

        // === Arequipa (The Highlands) ===
        {
            name: 'Tour Ciudad de Arequipa',
            category: 'Arequipa',
            url: 'es/tour/The-Highlands/Arequipa/tourArequipaCity.html',
            image: 'assets/img/SIerra/Arequipa/tour_Arequipa/tourArequipa.jpg'
        },
        {
            name: 'Tour Cañón del Colca',
            category: 'Arequipa',
            url: 'es/tour/The-Highlands/Arequipa/tourColcaCanyon.html',
            image: 'assets/img/SIerra/Arequipa/Tour_CañonColca/CañonColaca.jpg'
        },

        // === Cuzco (The Highlands) ===
        {
            name: 'Tour Ciudad de Cusco',
            category: 'Cuzco',
            url: 'es/tour/The-Highlands/Cuzco/tourCuzcoCity.html',
            image: 'assets/img/SIerra/Cuzco/Tour-de-Cuzco/TourCityCuzco.jpg'
        },
        {
            name: 'Inca Bike & Jungle Trek',
            category: 'Cuzco',
            url: 'es/tour/The-Highlands/Cuzco/tourIncaBike&JungleTrek.html',
            image: 'assets/img/SIerra/Cuzco/IncaBikeJungleTrek/InkaBike.jpg'
        },
        {
            name: 'Camino Inca Clásico',
            category: 'Cuzco',
            url: 'es/tour/The-Highlands/Cuzco/tourIncaTrailClassicTrek.html',
            image: 'assets/img/SIerra/Cuzco/Clásico_trekenCamino_Inca/CaminoInka.jpg'
        },
        {
            name: 'Camino Inca: Salkantay Trek',
            category: 'Cuzco',
            url: 'es/tour/The-Highlands/Cuzco/tourIncaTrailSalkantayTrek.html',
            image: 'assets/img/SIerra/Cuzco/IncaTrailSalkantayTrek/InkaTrailSalkantay.jpg'
        },
        {
            name: 'Tour Machu Picchu Full-Day',
            category: 'Cuzco',
            url: 'es/tour/The-Highlands/Cuzco/tourMachuPicchuDayTrip.html',
            image: 'assets/img/SIerra/Cuzco/Machu-Picchu-en-Un-Día/MachuPicchu1Dias.jpg'
        },
        {
            name: 'Canotaje (Rafting)',
            category: 'Cuzco',
            url: 'es/tour/The-Highlands/Cuzco/tourWhiteWaterRafting.html',
            image: 'assets/img/SIerra/Cuzco/Canotaje/CanotajeCuzco.jpg'
        },

        // === Lake Titicaca (The Highlands) ===
        {
            name: 'Tour Lago Titicaca en Bote',
            category: 'Lake Titicaca',
            url: 'es/tour/The-Highlands/Lake-Titicaca/tourLakeTiticacaBoat.html',
            image: 'assets/img/SIerra/Lago_Titi/Lago-Titicaca-en-Lancha/LagoTitikaka.jpg'
        },
        
        // === Shore Excursions (Callao) ===
        {
            name: 'Excursión en Tierra: Museo Larco',
            category: 'Cruceros desde Callao',
            url: 'es/ShoreExcursions/FromCallaoCruiseTerminal/tourShoreExcursionsLarcoMuseum.html',
            image: 'assets/img/Excursiones/Terminal_Callao/Excursiones_tierra_MuseoLarco/museoLarco.jpg'
        },
        {
            name: 'Excursión en Tierra: Pachacamac',
            category: 'Cruceros desde Callao',
            url: 'es/ShoreExcursions/FromCallaoCruiseTerminal/tourShoreExcursionstoPachacamacArchaeological.html',
            image: 'assets/img/Excursiones/Terminal_Callao/Excursiones_tierra_Sitios_arqueológicos_Pachacamac/Lima.jpg'
        },

        // === Shore Excursions (Salaverry) ===
        {
            name: 'Excursión en Tierra: Chan Chan',
            category: 'Cruceros desde Salaverry',
            url: 'es/ShoreExcursions/FromSalaverryCruiseTerminal/tourShoreExcursionsChanChan.html',
            image: 'assets/img/Excursiones/Terminal_Salaverry/Excursiones_tierra_ChanChan/ExcursionesChanChan.jpg'
        },

        // === Shore Excursions (Pisco/Paracas) ===
        {
            name: 'Vuelo Líneas de Nazca',
            category: 'Cruceros desde Pisco/Paracas',
            url: 'es/ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourNazcaLinesFlight.html',
            image: 'assets/img/Excursiones/Terminal_Paracas/Vuelo_las_Líneas_Nazca/ExcursionesLineasN.jpg'
        },
        {
            name: 'Excursión en Tierra: Islas Ballestas',
            category: 'Cruceros desde Pisco/Paracas',
            url: 'es/ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourShoreExcursionsIslasBallestas.html',
            image: 'assets/img/Excursiones/Terminal_Paracas/Excursiones_tierra_IslasBallestas/ExcursionesIslasBallestas.jpg'
        },
        {
            name: 'Excursión en Tierra: Tambo Colorado',
            category: 'Cruceros desde Pisco/Paracas',
            url: 'es/ShoreExcursions/FromTPPPiscoParacasCruiseTerminal/tourShoreExcursionsTamboColorado.html',
            image: 'assets/img/Excursiones/Terminal_Paracas/Excursiones_tierra_TamboColorado/ExcursionesTamboColorado.jpg'
        },

       // === Peru Packages (¡Añadidos aquí!) ===
        {
            name: 'Machu Picchu y El Valle Sagrado de los Incas',
            category: 'Peru Packages',
            url: 'es/PeruPackages/MachuPicchuYTheSecretValleyofIncas/tourMachuPicchu&ValleyIncas.html',
            image: 'assets/img/Paquetes_Peru/Machu_Picchu_Valle/MACHUPICCHU_VALLE_SECRETO_LOS_INCAS_7_días/MachuPicchuValle.jpg'
        },
        
        // MysetrioesOfTheSouthCoast(2Days/1 night) ===
        {
            name: 'Misterios de la Costa Sur (2 Días / 1 Noche)',
            category: 'MysetrioesOfTheSouthCoast',
            url: 'es/PeruPackages/MysetrioesOfTheSouthCoast/tourNazcaLinesFlightSouthCoast.html',
            image: 'assets/img/Paquetes_Peru/Misterios_Costa/Misterios_Costa_Sur/paqueteMisteriosSur.jpg'
        },
        {
            name: 'Upgrade VIP para Tour Costa Sur',
            category: 'MysetrioesOfTheSouthCoast',
            url: 'es/PeruPackages/MysetrioesOfTheSouthCoast/tourUpgradeToVip.html',
            image: 'assets/img/Paquetes_Peru/Misterios_Costa/Servicio_Mejorado_VIP/VipMisterios.jpg'
        }
    ];

    // 4. SELECCIÓN DE DATOS
    // Si estamos en español, usamos la lista traducida y con enlaces a /es/
    const allDestinationsData = isSpanish ? allDestinationsDataEs : allDestinationsDataEn;

    // 5. CORRECCIÓN DE RUTA DE IMAGEN DINÁMICA
    // Si estamos en /es/, las imágenes necesitan subir un nivel (../)
    const imagePrefix = isSpanish ? "../" : "";

    const gridContainer = document.querySelector('.all-destinations-grid');
    if (!gridContainer) return;

    const categoriesString = gridContainer.dataset.category;

    const filteredList = allDestinationsData.filter(city => {
        // Si el data-category no existe o es "all", muestra todo (como antes)
        if (!categoriesString || categoriesString === 'all') {
            return true; 
        }

        // --- LÓGICA INTELIGENTE ---
        // Si el string de categorías INCLUYE una coma...
        if (categoriesString.includes(',')) {
            // ...lo tratamos como una lista.
            const categoriesToShow = categoriesString.split(',').map(cat => cat.trim());
            return categoriesToShow.includes(city.category);
        } else {
            // ...SI NO, usamos la lógica original de comparación directa.
            return city.category === categoriesString;
        }
    });

    // ¡AQUÍ ESTÁ LA MAGIA! Usamos la variable `BASE` de tu archivo `main.js`
    filteredList.forEach(city => {
        // Corrección de URL: Como ya hemos ajustado la URL dentro de `allDestinationsDataEs` para que incluya 'es/',
        // solo necesitamos BASE si queremos ir a la raíz absoluta, pero como BASE puede ser '../' o vacío, hay que tener cuidado.
        // La mejor estrategia aquí es NO usar BASE para la URL si ya la definimos relativa en el objeto de datos.
        
        // Pero espera, tu BASE es relativa dinámica. Si estamos en /es/tours.html, BASE es "../".
        // Si la URL es "es/tour/...", BASE + URL = "../es/tour/..." (Correcto, sale de es/ y vuelve a entrar).
        // Si la URL es "tour/...", BASE + URL = "../tour/..." (Correcto para inglés).
        
        // ¡OJO! Si `allDestinationsDataEs` tiene `url: 'es/tour/...'`, al estar en `/es/index.html` (BASE=""), 
        // el link será `es/tour/...` (Correcto).
        
        // PERO si estamos en `/es/tours.html` (BASE="../"), el link será `../es/tour/...`.
        // `../` te lleva a la raíz. `es/` te mete a español. Correcto.

        const cardHTML = `
            <a href="${BASE}${city.url}" class="destination-item-card">
                <img src="${BASE}${city.image}" alt="Destino: ${city.name}">
                <div class="city-name">
                    <span>${city.name}</span>
                </div>
            </a>
        `;
        gridContainer.innerHTML += cardHTML;
    });
});