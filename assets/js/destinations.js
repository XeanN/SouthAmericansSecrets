// 1. DETECCIÓN DE IDIOMA
// Verifica si la URL tiene "/es/" para determinar el idioma.
const isSpanish = window.location.pathname.includes("/es/");

// 2. DATA EN INGLÉS (ORIGINAL)
const topDestinationsEn = [
    {
        id: 'ica',
        image: 'assets/img/Costa/Ica_Huaca/Buggy_TourySandboard/15.jpg',
        title1: 'Ica',
        title2: 'Perú',
        url: 'tour/Coast-of-Peru/Ica-y-Huacachina/tourDuneBuggySandboardFalta.html'
    },
    {
        id: 'islas-ballestas',
        image: 'assets/img/Costa/tours_Paracas/IslasBallestas/62.jpg',
        title1: 'Islas Ballestas',
        title2: 'Perú',
        url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourIslasBallestas.html'
    },
    {
        id: 'huacachina',
        image: 'assets/img/Costa/Ica_Huaca/Viñedo_MuseoOasis/16.jpg',
        title1: 'Huacachina',
        title2: 'Perú',
        url: 'tour/Coast-of-Peru/Ica-y-Huacachina/tourVineyardMuseumOasisTour.html'
    },
    {
        id: 'lima',
        image: 'assets/img/Costa/tours_Lima/Tour_de_Lima/37.jpg',
        title1: 'Lima',
        title2: 'Perú',
        url: 'tour/Coast-of-Peru/Lima/tourLimaCityTour.html'
    }
];

// 3. DATA EN ESPAÑOL (TRADUCIDA)
// Nota: En este caso los títulos son nombres propios que se mantienen,
// pero si tuvieras una descripción, iría aquí.
const topDestinationsEs = [
    {
        id: 'ica',
        image: 'assets/img/Costa/Ica_Huaca/Buggy_TourySandboard/15.jpg',
        title1: 'Ica',
        title2: 'Perú',
        // NOTA: Los enlaces deben apuntar a la versión en español (dentro de /es/)
        url: 'tour/Coast-of-Peru/Ica-y-Huacachina/tourDuneBuggySandboardFalta.html' 
    },
    {
        id: 'islas-ballestas',
        image: 'assets/img/Costa/tours_Paracas/IslasBallestas/62.jpg',
        title1: 'Islas Ballestas',
        title2: 'Perú',
        url: 'tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/tourIslasBallestas.html'
    },
    {
        id: 'huacachina',
        image: 'assets/img/Costa/Ica_Huaca/Viñedo_MuseoOasis/16.jpg',
        title1: 'Huacachina',
        title2: 'Perú',
        url: 'tour/Coast-of-Peru/Ica-y-Huacachina/tourVineyardMuseumOasisTour.html'
    },
    {
        id: 'lima',
        image: 'assets/img/Costa/tours_Lima/Tour_de_Lima/37.jpg',
        title1: 'Lima',
        title2: 'Perú',
        url: 'tour/Coast-of-Peru/Lima/tourLimaCityTour.html'
    }
];

// 4. SELECCIÓN DE DATOS
const topDestinations = isSpanish ? topDestinationsEs : topDestinationsEn;

// 5. CORRECCIÓN DE RUTA DE IMAGEN DINÁMICA
// Si estamos en /es/index.html, las imágenes necesitan subir un nivel (../)
const imagePrefix = isSpanish ? "../" : "";

// ESTE ES EL ÚNICO BLOQUE QUE NECESITAS PARA MOSTRAR LAS TARJETAS
document.addEventListener('DOMContentLoaded', () => {
    const destinationsContainer = document.querySelector('.destinations-grid');

    if (!destinationsContainer) return;

    destinationsContainer.innerHTML = '';

    topDestinations.forEach(destination => {
        // Corrección de la URL: Si estamos en inglés, la URL ya es correcta. Si estamos en español,
        // la URL de 'topDestinationsEs' ya apunta a 'es/...'.
        const finalUrl = isSpanish ? destination.url : destination.url;
        
        const cardHTML = `
            <div class="card" id="${destination.id}">
                
                <a href="${finalUrl}">
                    <img src="${imagePrefix}${destination.image}" alt="${destination.title1}, ${destination.title2}">
                </a>
                
                <div class="card-info">
                    <h3>
                        <span>${destination.title1}</span>
                        <span>${destination.title2}</span>
                    </h3>
                </div>
            </div>
        `;

        destinationsContainer.innerHTML += cardHTML;
    });
});