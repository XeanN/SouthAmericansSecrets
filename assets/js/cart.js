document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIÓN 1: DIBUJAR EL CARRITO ---
    function renderCart() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const subtotalElement = document.getElementById('cart-subtotal');
        const totalElement = document.getElementById('cart-total');
        const cartHeader = document.querySelector('.cart-header');
        const cartSummary = document.querySelector('.cart-summary');
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

        cartItemsContainer.innerHTML = '';
        let cartTotal = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message">Tu carrito de compras está vacío.</p>';
            if (cartHeader) cartHeader.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
        } else {

            if (cartHeader) cartHeader.style.display = '';
            if (cartSummary) cartSummary.style.display = '';

            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                cartTotal += itemSubtotal;
                const cartItemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="item-info"><div class="item-image" style="background-image: url('${item.image}')"></div><span>${item.name}</span></div>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <div class="item-quantity"><div class="quantity-selector"><button class="quantity-btn decrease">-</button><input type="text" value="${item.quantity}" readonly><button class="quantity-btn increase">+</button></div></div>
                        <div class="item-subtotal">$${itemSubtotal.toFixed(2)}</div>
                        <div class="item-remove remove-btn">×</div>
                    </div>`;
                cartItemsContainer.innerHTML += cartItemHTML;
            });
            if (subtotalElement && totalElement) {
                subtotalElement.textContent = `$${cartTotal.toFixed(2)}`;
                totalElement.textContent = `$${cartTotal.toFixed(2)}`;
            }
        }
    }

    // --- FUNCIÓN 2: MANEJAR CLICS EN LOS ITEMS ---
    function setupItemEventListeners() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            const cartItem = target.closest('.cart-item');
            if (!cartItem) return;

            const tourId = cartItem.dataset.id;
            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const tourIndex = cart.findIndex(item => item.id === tourId);
            if (tourIndex === -1) return;

            if (target.classList.contains('increase')) cart[tourIndex].quantity++;
            if (target.classList.contains('decrease')) {
                if (cart[tourIndex].quantity > 1) cart[tourIndex].quantity--;
                else cart.splice(tourIndex, 1);
            }
            if (target.classList.contains('remove-btn')) cart.splice(tourIndex, 1);
            
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            renderCart();
        });
    }

    // --- ¡NUEVO! FUNCIÓN 3: MANEJAR CLICS EN BOTONES DE RESUMEN ---
    function setupSummaryEventListeners() {
        const checkoutBtn = document.querySelector('.btn-checkout');
        const updateBtn = document.querySelector('.btn-update');
        const applyCouponBtn = document.querySelector('.btn-apply-coupon');

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                // Redirigir a la página de checkout
                window.location.href = 'checkout.html';
            });
        }

        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                // Simplemente muestra una alerta como funcionalidad temporal
                alert('Carrito actualizado');
            });
        }

        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => {
                const couponInput = document.querySelector('.coupon-section input');
                if (couponInput && couponInput.value) {
                    alert(`Cupón "${couponInput.value}" aplicado (funcionalidad futura).`);
                    couponInput.value = '';
                } else {
                    alert('Por favor, ingresa un código de cupón.');
                }
            });
        }
    }

    // --- INICIALIZACIÓN ---
    renderCart();
    setupItemEventListeners();
    setupSummaryEventListeners(); // <-- Llamamos a la nueva función
});