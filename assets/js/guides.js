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
