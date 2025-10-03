const destinations = [
  { city: "Lima", img: "assets/img/cities/lima.jpg" },
  { city: "Cusco", img: "assets/img/cities/cusco.jpg" },
  { city: "Arequipa", img: "assets/img/cities/arequipa.jpg" },
  { city: "Ica", img: "assets/img/cities/ica.jpg" },
  { city: "Paracas", img: "assets/img/cities/paracas.jpg" },
  { city: "Nazca", img: "assets/img/cities/nazca.jpg" },
  { city: "Puno", img: "assets/img/cities/puno.jpg" },
  { city: "Trujillo", img: "assets/img/cities/trujillo.jpg" },
  { city: "Chiclayo", img: "assets/img/cities/chiclayo.jpg" },
  { city: "Tarapoto", img: "assets/img/cities/tarapoto.jpg" },
  { city: "Iquitos", img: "assets/img/cities/iquitos.jpg" },
  { city: "Piura", img: "assets/img/cities/piura.jpg" }
];

// assets/js/topdestinations.js

const topDestinations = [
    {
        id: 'ica',
        image: 'assets/img/ica-buggy.jpg',
        // CAMBIO: Ahora el título tiene dos partes
        title1: 'Ica',
        title2: 'Perú'
    },
    {
        id: 'islas-ballestas',
        image: 'assets/img/nazca_p.1.jpg',
        title1: 'Islas Ballestas',
        title2: 'Perú'
    },
    {
        id: 'huacachina',
        image: 'assets/img/huacachina.jpg',
        title1: 'Huacachina',
        title2: 'Perú'
    },
    {
        id: 'lima',
        image: 'assets/img/lima-costa.jpg',
        title1: 'Lima',
        title2: 'Perú'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const destinationsContainer = document.querySelector('.destinations-grid');

    if (!destinationsContainer) return;

    destinationsContainer.innerHTML = '';

    topDestinations.forEach(destination => {
        // CAMBIO: Ahora construimos el h3 con dos spans adentro
        const cardHTML = `
            <div class="card" id="${destination.id}">
                <img src="${destination.image}" alt="${destination.title1}, ${destination.title2}">
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
const grid = document.getElementById('destinationsGrid');

destinations.forEach(dest => {
    const card = document.createElement('div');
    card.classList.add('destination-card');
    card.innerHTML = `
    <img src="${dest.img}" alt="${dest.city}">
    <div class="city">${dest.city}</div>
    `;
    grid.appendChild(card);
});
