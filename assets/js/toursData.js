const toursData = {
    // ==========================================================================
    // === COSTA DE PERÚ
    // ==========================================================================

    // --- Ica y Huacachina ---
    "dune-buggy-sandboard-huacachina": {
        title: "Dune Buggy & Sandboard",
        price: 25,
        minPersons: 1,
        duration: "1.5 Hours",
        rating: "4.7 (8 reviews)",
        image: '../assets/img/Costa/Ica_Huaca/Buggy_TourySandboard/14.jpg',
    },
    "vineyard-museum-oasis-tour": {
        title: "Vineyard Museum Oasis Tour",
        price: 25,
        minPersons: 2,
        duration: "2.5 Hours",
        rating: "4.5 (6 reviews)",
        image: "assets/img/Costa/Ica_Huaca/Viñedo_MuseoOasis/16.jpg"
    },

    // --- Lima ---
    "caral-tour": {
        title: "Caral",
        price: 195,
        minPersons: 2,
        duration: "Full Day",
        rating: "4.8 (7 reviews)",
        image: "assets/img/Costa/tours_Lima/Caral/19.jpg"
    },
    "nazca-lines-from-lima-vip": {
        title: "Flights Over Nazca Lines From Lima (1-day VIP Private)",
        price: 430,
        minPersons: 2,
        duration: "12 Hours",
        rating: "4.6 (8 reviews)",
        image: "assets/img/Costa/tours_Lima/Sobrevuele_las_líneas_de_Nazca_desde_Pisco_1-díaServicio-Privado/34.jpg"
    },
    "lima-city-tour": {
        title: "Lima City Tour",
        price: 55,
        minPersons: 2,
        duration: "4 Hours",
        rating: "4.9 (120 reviews)", // Mantenido por ser específico
        image: "assets/img/Costa/tours_Lima/Tour_de_Lima/37.jpg"
    },
    "museums-of-lima": {
        title: "Museums Of Lima",
        price: 50,
        minPersons: 2,
        duration: "4 Hours",
        rating: "4.5 (7 reviews)",
        image: "assets/img/Costa/tours_Lima/MuseosdeLima/22.jpg"
    },
    "nightlife-in-lima": {
        title: "Nightlife In Lima",
        price: 55,
        minPersons: 2,
        duration: "4 Hours",
        rating: "4.7 (6 reviews)",
        image: "assets/img/Costa/tours_Lima/Nocturna/25.jpg"
    },
    "pachacamac-tour": {
        title: "Pachacamac",
        price: 45,
        minPersons: 2,
        duration: "12 Hours",
        rating: "4.6 (8 reviews)",
        image: "assets/img/Costa/tours_Lima/Pachacamac/31.jpg"
    },
    "peruvian-gold-museum": {
        title: "Peruvian Gold",
        price: 50,
        minPersons: 2,
        duration: "3 Hours",
        rating: "4.8 (7 reviews)",
        image: "assets/img/Costa/tours_Lima/Oro_de_Perú/28.jpg"
    },

    // --- Nazca Lines ---
    "cantalloc-aqueducts": {
        title: "Cantalloc Aqueducts",
        price: 20,
        minPersons: 2,
        duration: "2 Hours",
        rating: "4.5 (8 reviews)",
        image: "assets/img/Costa/LineasNazca/Acueductos_de_Cantalloc/40.jpg"
    },
    "chauchilla-cemetery": {
        title: "Chauchilla Cemetery",
        price: 25,
        minPersons: 2,
        duration: "2.5 Hours",
        rating: "4.7 (6 reviews)",
        image: "assets/img/Costa/LineasNazca/Cemetario_Chaucilla/43.jpg"
    },
    "nazca-lines-flight": {
        title: "Nazca Lines",
        price: 120,
        minPersons: 2,
        duration: "35 Mins",
        rating: "4.8 (8 reviews)",
        image: "assets/img/Costa/LineasNazca/Lineas_de_Nazca/46.jpg"
    },
    "nazca-lines-from-paracas": {
        title: "Nazca Lines from Paracas",
        price: 280,
        minPersons: 2,
        duration: "1 Hour 45 Mins",
        rating: "4.6 (7 reviews)",
        image: "assets/img/Costa/LineasNazca/Líneas_de_Nazca_desde_Paracas/46.jpg"
    },
    "pampas-galeras-reserve": {
        title: "Pampas Galeras Reserve",
        price: 60,
        minPersons: 2,
        duration: "6 Hours",
        rating: "4.5 (6 reviews)",
        image: "assets/img/Costa/LineasNazca/ReservaPampasGaleras/49.jpg"
    },

    // --- North Coast ---
    "chan-chan-tour": {
        title: "Chan Chan",
        price: 0, // A consultar
        minPersons: 2,
        duration: "3 Hours",
        rating: "4.7 (8 reviews)",
        image: "assets/img/Costa/Costa_Norte/ChanChan/1.jpg"
    },
    "mangroves-of-tumbes": {
        title: "Mangroves Of Tumbes",
        price: 100,
        minPersons: 2,
        duration: "12 Hours",
        rating: "4.8 (7 reviews)",
        image: "assets/img/Costa/Costa_Norte/Manglares_de_Tumbes/7.jpg"
    },
    "snorkel-with-turtles": {
        title: "Snorkel With Turtles",
        price: 35,
        minPersons: 2,
        duration: "2 Hours",
        rating: "4.6 (6 reviews)",
        image: "assets/img/Costa/Costa_Norte/Snorkel_con_las_tortugas/10.jpg"
    },
    "temple-of-the-moon": {
        title: "Temple Of The Moon",
        price: 25,
        minPersons: 2,
        duration: "3 Hours",
        rating: "4.5 (8 reviews)",
        image: "assets/img/Costa/Costa_Norte/Huaca_de_la_Luna/4.jpg"
    },

    // --- Paracas y Islas Ballestas ---
    "biking-paracas": {
        title: "Biking Paracas",
        price: 18,
        minPersons: 1,
        duration: "5 Hours",
        rating: "4.7 (7 reviews)",
        image: "assets/img/Costa/tours_Paracas/LaReservaParacasBici/67.jpg"
    },
    "cruise-member-islas-ballestas-first-class": {
        title: "Cruise Member Islas Ballestas First Class",
        price: 110,
        minPersons: 1,
        duration: "5-6 Hours",
        rating: "4.8 (6 reviews)",
        image: "assets/img/Costa/tours_Paracas/Tour_primera_Islas_ballestas_miembros_cruceros/76.jpg"
    },
    "cruise-member-islas-ballestas-standard-tour": {
        title: "Cruise Member Islas Ballestas Standard Tour",
        price: 85,
        minPersons: 1,
        duration: "5-6 Hours",
        rating: "4.6 (8 reviews)",
        image: "assets/img/Costa/tours_Paracas/Tour_Islas_ballestas_miembros_ruceros_standard_tours/73.jpg"
    },
    "cruise-shore-excursions": {
        title: "Cruise Shore Excursions",
        price: 0, // A consultar
        minPersons: 1,
        duration: "Varies",
        rating: "4.5 (7 reviews)",
        image: "assets/img/Costa/tours_Paracas/ExcursionesCrucero/58.jpg"
    },
    "dune-buggy-sandboard-paracas": {
        title: "Dune Buggy & Sandboard",
        price: 50,
        minPersons: 2,
        duration: "2 Hours",
        rating: "4.7 (6 reviews)",
        image: "assets/img/Costa/tours_Paracas/Tubular_Arenero_Sandboard/82.jpg"
    },
    "islas-ballestas": {
        title: "Islas Ballestas",
        price: 17,
        minPersons: 2,
        duration: "2 Hours",
        rating: "4.8 (8 reviews)",
        image: "assets/img/Costa/tours_Paracas/IslasBallestas/60.jpg"
    },
    "islas-ballestas-first-class": {
        title: "Islas Ballestas First Class",
        price: 50,
        minPersons: 1,
        duration: "2 Hours",
        rating: "4.6 (7 reviews)",
        image: "assets/img/Costa/tours_Paracas/IslasBallestasFirstClass/63.jpg"
    },
    "kayak-paracas-bay": {
        title: "Kayak Paracas Bay",
        price: 20,
        minPersons: 2,
        duration: "2 Hours",
        rating: "4.5 (6 reviews)",
        image: "assets/img/Costa/tours_Paracas/LaReservaParacasBici/69.jpg"
    },
    "paracas-national-reserve": {
        title: "Paracas National Reserve",
        price: 29,
        minPersons: 2,
        duration: "3 Hours",
        rating: "4.8 (210 reviews)", // Mantenido por ser específico
        image: "assets/img/Costa/tours_Paracas/La_Reserva_Nacional_Paracas/70.jpg"
    },
    "private-tour-paracas": {
        title: "Private Tour",
        price: 300,
        minPersons: 2,
        duration: "2 Hours",
        rating: "4.7 (8 reviews)",
        image: "assets/img/Costa/tours_Paracas/Tour_Privado/79.jpg"
    },
    "yacht-charter-paracas": {
        title: "Yacht Charter",
        price: 180,
        minPersons: 2,
        duration: "2 Hours (min)",
        rating: "4.8 (7 reviews)",
        image: "assets/img/Costa/tours_Paracas/CharterYate/55.jpg"
    },

    // ==========================================================================
    // === SIERRA (THE HIGHLANDS)
    // ==========================================================================

    // --- Arequipa ---
    "arequipa-city-tour": {
        title: "Arequipa City Tour",
        price: 60,
        minPersons: 2,
        duration: "4 Hours",
        rating: "4.6 (6 reviews)",
        image: "assets/img/SIerra/Arequipa/tour_Arequipa/85.jpg"
    },
    "colca-canyon-tour": {
        title: "Colca Canyon Tour",
        price: 36,
        minPersons: 2,
        duration: "4 Hours",
        rating: "4.5 (8 reviews)",
        image: "assets/img/SIerra/Arequipa/Tour_CañonColca/88.jpg"
    },

    // --- Cuzco ---
    "cuzco-city-tour": {
        title: "Cuzco City Tour",
        price: 60,
        minPersons: 2,
        duration: "4 Hours",
        rating: "4.7 (7 reviews)",
        image: "assets/img/SIerra/Cuzco/Tour-de-Cuzco/109.jpg"
    },
    "inca-bike-jungle-trek": {
        title: "Inca Bike & Jungle Trek",
        price: 260,
        minPersons: 2,
        duration: "4 Days (3 Nights)",
        rating: "4.8 (6 reviews)",
        image: "assets/img/SIerra/Cuzco/IncaBikeJungleTrek/100.jpg"
    },
    "inca-trail-classic-trek": {
        title: "Inca Trail Classic Trek",
        price: 260,
        minPersons: 2,
        duration: "4 Days (3 Nights)",
        rating: "4.6 (8 reviews)",
        image: "assets/img/SIerra/Cuzco/Clásico_trekenCamino_Inca/97.jpg"
    },
    "inca-trail-salkantay-trek": {
        title: "Inca Trail Salkantay Trek",
        price: 260,
        minPersons: 2,
        duration: "4 Days (3 Nights)",
        rating: "4.5 (7 reviews)",
        image: "assets/img/SIerra/Cuzco/IncaTrailSalkantayTrek/103.jpg"
    },
    "machu-picchu-day-trip": {
        title: "Machu Picchu Day Trip",
        price: 330,
        minPersons: 2,
        duration: "14 Hours",
        rating: "4.7 (6 reviews)",
        image: "assets/img/SIerra/Cuzco/Machu-Picchu-en-Un-Día/106.jpg"
    },
    "white-water-rafting-cuzco": {
        title: "White Water Rafting",
        price: 260,
        minPersons: 2,
        duration: "1 Day",
        rating: "4.8 (8 reviews)",
        image: "assets/img/SIerra/Cuzco/Canotaje/94.jpg"
    },

    // --- Lake Titicaca ---
    "lake-titicaca-boat-tour": {
        title: "Lake Titicaca Boat Tour",
        price: 60,
        minPersons: 2,
        duration: "Over 10 Hours",
        rating: "4.6 (7 reviews)",
        image: "assets/img/SIerra/Lago_Titi/Lago-Titicaca-en-Lancha/91.jpg"
    },

    // ==========================================================================
    // === SELVA (RAINFOREST)
    // ==========================================================================

    // --- Manu Reserve & Tambopata ---
    "manu-reserve-tour": {
        title: "Manu Reserve",
        price: 100,
        minPersons: 2,
        duration: "12 Hours",
        rating: "4.5 (6 reviews)",
        image: "assets/img/Selva_Tropical/Parque_Manu/112.jpg"
    },
    "tambopata-reserve-tour": {
        title: "Tambopata Reserve",
        price: 260,
        minPersons: 2,
        duration: "5 Days (4 Nights)",
        rating: "4.7 (8 reviews)",
        image: "assets/img/Selva_Tropical/Tambopata/Tambopata/115.jpg"
    },
    
    // ==========================================================================
    // === EXCURSIONES PARA CRUCEROS (SHORE EXCURSIONS)
    // ==========================================================================
    
    // --- Desde Callao ---
    "shore-excursions-larco-museum": {
        title: "Shore Excursions to Larco Museum",
        price: 75,
        minPersons: 2,
        duration: "6 Hours",
        rating: "4.8 (7 reviews)",
        image: "assets/img/Excursiones/Terminal_Callao/Excursiones_tierra_MuseoLarco/127.jpg"
    },
    "shore-excursions-pachacamac": {
        title: "Shore Excursions to Pachacamac Archaeological Sites",
        price: 85,
        minPersons: 2,
        duration: "8 Hours",
        rating: "4.6 (6 reviews)",
        image: "assets/img/Excursiones/Terminal_Callao/Excursiones_tierra_Sitios_arqueológicos_Pachacamac/130.jpg"
    },
    
    // --- Desde Salaverry ---
    "shore-excursions-chan-chan": {
        title: "Shore Excursions to Chan Chan",
        price: 85,
        minPersons: 2,
        duration: "6 Hours",
        rating: "4.5 (8 reviews)",
        image: "assets/img/Excursiones/Terminal_Salaverry/Excursiones_tierra_ChanChan/142.jpg"
    },
    
    // --- Desde Pisco / Paracas ---
        "nazca-lines-flight-from-pisco-cruise": {
        title: "Nazca Lines Flight from Pisco Cruise Terminal",
        price: 380,
        minPersons: 2,
        duration: "6 Hours",
        rating: "4.7 (7 reviews)",
        image: "assets/img/Excursiones/Terminal_Paracas/Vuelo_las_Líneas_Nazca/139.jpg"
    },
    "shore-excursions-islas-ballestas-from-pisco": {
        title: "Shore Excursions to Islas Ballestas",
        price: 100,
        minPersons: 2,
        duration: "6 Hours",
        rating: "4.8 (6 reviews)",
        image: "assets/img/Excursiones/Terminal_Paracas/Excursiones_tierra_IslasBallestas/133.jpg"
    },
    "shore-excursions-tambo-colorado": {
        title: "Shore Excursions to Tambo Colorado",
        price: 95,
        minPersons: 2,
        duration: "8 Hours",
        rating: "4.6 (8 reviews)",
        image: "assets/img/Excursiones/Terminal_Paracas/Excursiones_tierra_TamboColorado/136.jpg"
    },

    // ==========================================================================
    // === PAQUETES DE PERÚ (PERU PACKAGES)
    // ==========================================================================
    "machu-picchu-sacred-valley-7-days": {
        title: "Machu Picchu & The Secret Valley of the Incas",
        price: 1600,
        minPersons: 1,
        duration: "6 Days",
        rating: "4.5 (7 reviews)",
        image: "assets/img/Paquetes_Peru/Machu_Picchu_Valle/MACHUPICCHU_VALLE_SECRETO_LOS_INCAS_7_días/118.jpg"
    },
    "mysteries-of-south-coast-2-days": {
        title: "Nazca Lines Flight & South Coast",
        price: 565,
        minPersons: 2,
        duration: "2 Days / 1 Night",
        rating: "4.7 (6 reviews)",
        image: "assets/img/Paquetes_Peru/Misterios_Costa/Misterios_Costa_Sur/121.jpg"
    },
    "mysteries-of-south-coast-vip-upgrade": {
        title: "Nazca Lines Flight & South Coast - Upgrade to VIP",
        price: 886,
        minPersons: 2,
        duration: "2 Days / 1 Night",
        rating: "4.8 (8 reviews)",
        image: "assets/img/Paquetes_Peru/Misterios_Costa/Servicio_Mejorado_VIP/124.jpg"
    }
};