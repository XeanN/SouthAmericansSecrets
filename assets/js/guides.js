const guides = [
  {
    name: "Lucio Hancco",
    role: "Tour Advisor & Tour Guide",
    img: "assets/img/guides/lucio.jpg"
  },
  {
    name: "Maria Gutierrez",
    role: "Senior Tour Guide",
    img: "assets/img/guides/maria.jpg"
  },
  {
    name: "Pedro Salazar",
    role: "Cultural Guide",
    img: "assets/img/guides/pedro.jpg"
  },
  {
    name: "Sofia Ramirez",
    role: "Nature & Adventure Guide",
    img: "assets/img/guides/sofia.jpg"
  },
  {
    name: "Carlos Quispe",
    role: "History Expert Guide",
    img: "assets/img/guides/carlos.jpg"
  }
];
// assets/js/guides.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. LA LISTA DE GUÍAS (Nuestra "Base de Datos" del equipo)
    const tourGuides = [
        {
            image: 'assets/img/guides/guide-1.jpg',
            name: 'Lucio Hancco',
            role: 'Tour Advisor & Tour Guide'
        },
        {
            image: 'assets/img/nazca_p.1.jpg',
            name: 'Maria Quispe',
            role: 'Cultural Specialist'
        },
        {
            image: 'assets/img/guides/guide-3.jpg',
            name: 'Carlos Mendoza',
            role: 'Adventure Guide'
        },
        {
            image: 'assets/img/guides/guide-4.jpg',
            name: 'Sofia Reyes',
            role: 'Lead Tour Coordinator'
        },
        {
            image: 'assets/img/guides/guide-5.jpg',
            name: 'Javier Flores',
            role: 'Historical Expert'
        },

    ];

    // 2. EL CONTENEDOR (Donde irán las tarjetas)
    const gridContainer = document.querySelector('.guides-grid');

    if (!gridContainer) return; // Si no existe el contenedor, no hacemos nada.

    // 3. LA LÓGICA (Crear una tarjeta por cada guía)
    tourGuides.forEach(guide => {
        const cardHTML = `
            <div class="guide-card">
                <img src="${guide.image}" alt="Foto de ${guide.name}">
                <div class="guide-info">
                    <h4>${guide.name}</h4>
                    <span>${guide.role}</span>
                </div>
            </div>
        `;
        gridContainer.innerHTML += cardHTML;
    });

});

const guidesGrid = document.getElementById('guidesGrid');

guides.forEach(guide => {
  const card = document.createElement('div');
  card.classList.add('guide-card');
  card.innerHTML = `
    <img src="${guide.img}" alt="${guide.name}">
    <div class="guide-info">
      <h4>${guide.name}</h4>
      <span>${guide.role}</span>
    </div>
  `;
  guidesGrid.appendChild(card);
});
