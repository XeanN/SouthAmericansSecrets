// --- PEGA ESTO EN assets/js/dashboard.js ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. ¡CORREGIDO! Seleccionamos SÓLO las pestañas que tienen [data-tab]
    const tabs = document.querySelectorAll('.tab-link[data-tab]');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            
            /* 2. ¡BORRAMOS EL IF! Ya no es necesario porque
               el selector de arriba ya no incluye el botón de logout.
            */

            // 1. Quitar 'active' de todas las pestañas y contenidos
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));

            // 2. Añadir 'active' a la pestaña clickeada
            tab.classList.add('active');
            
            // 3. Mostrar el contenido correspondiente
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Lógica simple para el botón de "Edit Profile" (Sin cambios)
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const inputs = document.querySelectorAll('#profile-form input');

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            inputs.forEach(input => {
                if (input.id !== 'profile-email') {
                    input.readOnly = false;
                    input.style.backgroundColor = '#fff';
                }
            });
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            inputs.forEach(input => {
                input.readOnly = true;
                input.style.backgroundColor = '#eee';
            });
            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            alert('Profile updated (frontend demo)');
        });
    }
});