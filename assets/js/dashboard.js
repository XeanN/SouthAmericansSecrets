document.addEventListener('DOMContentLoaded', () => {
    // Solo mantenemos la lógica de las pestañas
    const tabs = document.querySelectorAll('.tab-link[data-tab]');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});