document.addEventListener('DOMContentLoaded', () => {

    // 1. DETECCIÓN DE IDIOMA
    const isSpanish = window.location.pathname.includes("/es/");

    // 2. CORRECCIÓN DE RUTA DE IMAGEN DINÁMICA
    // Si estamos en /es/ (ej. about.html), las imágenes necesitan subir un nivel (../)
    const pathPrefix = isSpanish ? "../" : "";

    // 3. DATOS EN INGLÉS (ORIGINAL)
    const tourGuidesEn = [
        {
            image: 'assets/img/Guides/guide-1.jpg',
            name: 'Lucio Hancco',
            role: 'Tour advisor & tour guide'
        },
        {
            image: 'assets/img/Guides/guide-2.jpg',
            name: 'Amarilis Pereda',
            role: 'Vessel operator'
        },
        {
            image: 'assets/img/Guides/guide-3.jpg',
            name: 'Alberto Hernández',
            role: 'Vessel operator 2'
        },
        {
            image: 'assets/img/Guides/guide-4.jpg',
            name: 'Juan Carlos Oyola',
            role: 'Yacht keepers'
        },
        {
            image: 'assets/img/Guides/guide-5.jpg',
            name: 'Ilich Lenin Pereda',
            role: 'Yacht keepers'
        },
        {
            image: 'assets/img/Guides/guide-6.jpg',
            name: 'Karl Kevin H.',
            role: 'Yacht keepers'
        },
        {
            image: 'assets/img/Guides/guide-7.jpg',
            name: 'Rossmery Albarrán',
            role: 'Regional Manager'
        },
        {
            image: 'assets/img/Guides/guide-8.jpg',
            name: 'Karol Hancco',
            role: 'Product and Costing'
        },
        {
            image: 'assets/img/Guides/guide-9.jpg',
            name: 'Martin Vega',
            role: 'Tour guides coordinator'
        },
        {
            image: 'assets/img/Guides/guide-10.jpg',
            name: 'Abilio Dextre',
            role: 'French tour guide'
        }
    ];

    // 4. DATOS EN ESPAÑOL (TRADUCIDOS)
    const tourGuidesEs = [
        {
            image: 'assets/img/Guides/guide-1.jpg',
            name: 'Lucio Hancco',
            role: 'Asesor de tours y guía turístico'
        },
        {
            image: 'assets/img/Guides/guide-2.jpg',
            name: 'Amarilis Pereda',
            role: 'Operadora de embarcación'
        },
        {
            image: 'assets/img/Guides/guide-3.jpg',
            name: 'Alberto Hernández',
            role: 'Operador de embarcación 2'
        },
        {
            image: 'assets/img/Guides/guide-4.jpg',
            name: 'Juan Carlos Oyola',
            role: 'Mantenimiento de Yates'
        },
        {
            image: 'assets/img/Guides/guide-5.jpg',
            name: 'Ilich Lenin Pereda',
            role: 'Mantenimiento de Yates'
        },
        {
            image: 'assets/img/Guides/guide-6.jpg',
            name: 'Karl Kevin H.',
            role: 'Mantenimiento de Yates'
        },
        {
            image: 'assets/img/Guides/guide-7.jpg',
            name: 'Rossmery Albarrán',
            role: 'Gerente Regional'
        },
        {
            image: 'assets/img/Guides/guide-8.jpg',
            name: 'Karol Hancco',
            role: 'Producto y Costos'
        },
        {
            image: 'assets/img/Guides/guide-9.jpg',
            name: 'Martin Vega',
            role: 'Coordinador de guías'
        },
        {
            image: 'assets/img/Guides/guide-10.jpg',
            name: 'Abilio Dextre',
            role: 'Guía turístico en francés'
        }
    ];

    // 5. SELECCIÓN DE DATOS
    const tourGuides = isSpanish ? tourGuidesEs : tourGuidesEn;

    // 6. EL CONTENEDOR (Donde irán las tarjetas)
    const gridContainer = document.querySelector('.guides-grid');

    if (!gridContainer) return; // Si no existe el contenedor, no hacemos nada.

    // Limpiamos el contenedor antes de agregar nada (buena práctica)
    gridContainer.innerHTML = '';

    // 7. LA LÓGICA (Crear una tarjeta por cada guía)
    tourGuides.forEach(guide => {
        const cardHTML = `
            <div class="guide-card">
                <img src="${pathPrefix}${guide.image}" alt="Foto de ${guide.name}">
                <div class="guide-info">
                    <h4>${guide.name}</h4>
                    <span>${guide.role}</span>
                </div>
            </div>
        `;
        gridContainer.innerHTML += cardHTML;
    });

});