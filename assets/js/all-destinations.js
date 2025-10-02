// assets/js/all-destinations.js

document.addEventListener('DOMContentLoaded', () => {
    
    // CAMBIO: Ahora es una lista de objetos, cada uno con nombre e imagen.
    const allDestinationsData = [
        { name: 'Cusco', image: 'assets/img/machu_picchu_p.jpg' },
        { name: 'Arequipa', image: 'assets/img/cities/arequipa.jpg' },
        { name: 'Lima', image: 'assets/img/cities/lima.jpg' },
        { name: 'Iquitos', image: 'assets/img/cities/iquitos.jpg' },
        { name: 'Puno', image: 'assets/img/cities/puno.jpg' },
        { name: 'Trujillo', image: 'assets/img/cities/trujillo.jpg' },
        { name: 'Máncora', image: 'assets/img/cities/mancora.jpg' },
        { name: 'Huaraz', image: 'assets/img/cities/huaraz.jpg' }
        // ... puedes añadir más ciudades aquí
    ];

    const gridContainer = document.querySelector('.all-destinations-grid');
    if (!gridContainer) return;

    allDestinationsData.forEach(city => {
        // CAMBIO: Ahora el HTML incluye una etiqueta <img>
        const cardHTML = `
            <div class="destination-item-card">
                <img src="${city.image}" alt="Destino: ${city.name}">
                <div class="city-name">
                    <span>${city.name}</span>
                </div>
            </div>
        `;
        gridContainer.innerHTML += cardHTML;
    });

});