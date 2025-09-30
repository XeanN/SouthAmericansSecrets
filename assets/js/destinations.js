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
