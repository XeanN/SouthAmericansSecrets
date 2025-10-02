const teamMembers = [
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
    role: "History Expert",
    img: "assets/img/guides/carlos.jpg"
  },
  {
    name: "Andrea López",
    role: "Logistics & Customer Care",
    img: "assets/img/guides/andrea.jpg"
  }
];

const teamGrid = document.getElementById('teamGrid');

teamMembers.forEach(member => {
  const card = document.createElement('div');
  card.classList.add('team-card');
  card.innerHTML = `
    <img src="${member.img}" alt="${member.name}">
    <div class="team-info">
      <h4>${member.name}</h4>
      <span>${member.role}</span>
    </div>
  `;
  teamGrid.appendChild(card);
});
