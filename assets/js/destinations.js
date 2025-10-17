// assets/js/topdestinations.js

const topDestinations = [
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

// ESTE ES EL ÚNICO BLOQUE QUE NECESITAS PARA MOSTRAR LAS TARJETAS
document.addEventListener('DOMContentLoaded', () => {
    const destinationsContainer = document.querySelector('.destinations-grid');

    if (!destinationsContainer) return;

    destinationsContainer.innerHTML = '';

    topDestinations.forEach(destination => {
        const cardHTML = `
            <div class="card" id="${destination.id}">
                
                <a href="${destination.url}">
                    <img src="${destination.image}" alt="${destination.title1}, ${destination.title2}">
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