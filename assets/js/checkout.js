document.addEventListener('DOMContentLoaded', () => {
    // 1. Recuperar los datos del sessionStorage
    const bookingDataJSON = sessionStorage.getItem('checkoutItem');

    // 2. Si no hay datos, crear datos de prueba
    let bookingData;
    if (!bookingDataJSON) {
        bookingData = {
            id: 'tour-001',
            title: 'Nazca Lines from Paracas',
            image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800',
            date: 'November 22, 2025',
            time: '08:00 AM',
            persons: 2,
            total: 560.00
        };
        console.log('Using test booking data');
    } else {
        bookingData = JSON.parse(bookingDataJSON);
    }

    // 4. Seleccionar los elementos del HTML
    const tourNameEl = document.getElementById('tour-name');
    const tourDateTimeEl = document.getElementById('tour-date-time');
    const totalPriceEl = document.getElementById('total-price');
    const tourImageEl = document.getElementById('tour-image');

    // 5. Rellenar la página con los datos
    tourNameEl.textContent = bookingData.title;
    tourDateTimeEl.textContent = `Date: ${bookingData.date} / Time: ${bookingData.time}`;
    totalPriceEl.textContent = `$${bookingData.total}`;
    tourImageEl.src = bookingData.image;
    tourImageEl.alt = bookingData.title;

    // Toggle animación seleccionar método
    document.querySelectorAll(".payment-option").forEach(option => {
        const label = option.querySelector('label');
        const radio = option.querySelector('input[type="radio"]');
        
        label.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.querySelectorAll(".payment-option").forEach(o => {
                o.classList.remove("active");
                const r = o.querySelector('input[type="radio"]');
                if (r) r.checked = false;
            });
            
            option.classList.add("active");
            radio.checked = true;
            
            console.log('Payment method selected:', option.dataset.method);
            
            if (option.dataset.method === 'card' && !mpInitialized) {
                setTimeout(() => {
                    console.log('Initializing Mercado Pago...');
                    initializeMercadoPago();
                }, 200);
            }
        });
        
        radio.addEventListener('change', () => {
            if (radio.checked) {
                document.querySelectorAll(".payment-option").forEach(o => {
                    o.classList.remove("active");
                });
                option.classList.add("active");
                
                if (option.dataset.method === 'card' && !mpInitialized) {
                    setTimeout(() => {
                        console.log('Initializing Mercado Pago...');
                        initializeMercadoPago();
                    }, 200);
                }
            }
        });
    });

    // ============================================
    // PAYPAL INTEGRATION - PRODUCTION READY
    // ============================================
    let paypalInitialized = false;

    function initializePayPal() {
        if (paypalInitialized) return;
        paypalInitialized = true;

        const container = document.getElementById('paypal-button-container');
        
        if (!container) {
            console.error('PayPal container not found!');
            return;
        }

        // Limpiar el contenedor por si acaso
        container.innerHTML = '';

        if (typeof paypal === 'undefined') {
            console.error('PayPal SDK not loaded!');
            container.innerHTML = `
                <div style="padding: 1.5rem; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c33;">
                    <strong>Error:</strong> PayPal SDK not loaded.
                </div>
            `;
            return;
        }

        try {
            paypal.Buttons({
                // Configuración del estilo del botón
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal'
                },

                // Crear la orden
                createOrder: function(data, actions) {
                    console.log('Creating PayPal order...');
                    
                    return actions.order.create({
                        purchase_units: [{
                            description: bookingData.title,
                            amount: {
                                currency_code: 'USD',
                                value: bookingData.total.toFixed(2)
                            },
                            custom_id: bookingData.id // Tu ID de reserva
                        }]
                    });
                },

                // Cuando el pago es aprobado
                onApprove: function(data, actions) {
                    console.log('Payment approved:', data);
                    
                    // Capturar el pago
                    return actions.order.capture().then(function(orderData) {
                        console.log('Payment captured:', orderData);
                        
                        // Verificar el estado
                        const transaction = orderData.purchase_units[0].payments.captures[0];
                        
                        if (transaction.status === 'COMPLETED') {
                            console.log('✅ Payment successful!');
                            
                            // IMPORTANTE: Aquí deberías enviar la confirmación a tu backend
                            // para guardar la transacción en tu base de datos
                            
                            // TODO: Descomentar cuando tengas backend
                            /*
                            fetch('/api/save-paypal-payment', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    orderId: data.orderID,
                                    bookingData: bookingData,
                                    paypalData: orderData
                                })
                            });
                            */
                            
                            // Mostrar confirmación
                            alert(`Payment successful!\n\nTransaction ID: ${transaction.id}`);
                            
                            // Redirigir a confirmación
                            saveAndRedirectToConfirmation();
                        } else {
                            alert('Payment status: ' + transaction.status);
                        }
                    });
                },

                // Si hay un error
                onError: function(err) {
                    console.error('PayPal error:', err);
                    alert('There was an error processing your payment. Please try again.');
                },

                // Si el usuario cancela
                onCancel: function(data) {
                    console.log('Payment cancelled:', data);
                    alert('Payment cancelled. You can try again when ready.');
                }
            }).render('#paypal-button-container');
            
            console.log('✅ PayPal buttons rendered');

        } catch (error) {
            console.error('Error initializing PayPal:', error);
            container.innerHTML = `
                <div style="padding: 1.5rem; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c33;">
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        }
    }

    // Modificar el listener de la opción PayPal
    document.querySelectorAll(".payment-option").forEach(option => {
        const label = option.querySelector('label');
        const radio = option.querySelector('input[type="radio"]');
        
        label.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.querySelectorAll(".payment-option").forEach(o => {
                o.classList.remove("active");
                const r = o.querySelector('input[type="radio"]');
                if (r) r.checked = false;
            });
            
            option.classList.add("active");
            radio.checked = true;
            
            console.log('Payment method selected:', option.dataset.method);
            
            // Inicializar PayPal si se selecciona
            if (option.dataset.method === 'paypal' && !paypalInitialized) {
                setTimeout(() => {
                    console.log('Initializing PayPal...');
                    initializePayPal();
                }, 200);
            }
            
            // Inicializar Mercado Pago si se selecciona
            if (option.dataset.method === 'card' && !mpInitialized) {
                setTimeout(() => {
                    console.log('Initializing Mercado Pago...');
                    initializeMercadoPago();
                }, 200);
            }
        });
    });

// Eliminar el código antiguo del botón PayPal (ya no lo necesitas)

    // ============================================
    // GOOGLE PAY INTEGRATION - DEMO
    // ============================================
    const googlePayBtn = document.querySelector('.google-btn');
    if (googlePayBtn) {
        googlePayBtn.addEventListener('click', () => {
            alert('Demo Mode: Google Pay integration requires:\n\n1. Google Pay Business account\n2. Merchant ID\n3. Payment processor setup\n\nIn production, the payment sheet would open here.');
        });
    }

    // ============================================
    // MERCADO PAGO INTEGRATION - PRODUCTION
    // ============================================
    let mpInitialized = false;
    let paymentBrickController = null;

    function initializeMercadoPago() {
        mpInitialized = true;
        const container = document.getElementById('paymentBrick_container');
        
        console.log('Container found:', container);
        
        if (!container) {
            console.error('paymentBrick_container not found!');
            return;
        }

        if (typeof MercadoPago === 'undefined') {
            console.error('Mercado Pago SDK not loaded!');
            container.innerHTML = `
                <div style="padding: 1.5rem; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c33;">
                    <strong>Error:</strong> Mercado Pago SDK not loaded.
                    <br><br>
                    <small>Please check the SDK script in your HTML.</small>
                </div>
            `;
            return;
        }

        try {
            // ⭐ AQUÍ ESTÁ TU PUBLIC KEY
            const mp = new MercadoPago('APP_USR-c9cebee3-1bdc-49ef-a2ba-8e333ba574dd', {
                locale: 'es-PE'
            });

            const bricksBuilder = mp.bricks();

            console.log('Creating Payment Brick...');

            bricksBuilder.create('payment', 'paymentBrick_container', {
                initialization: {
                    amount: parseFloat(bookingData.total),
                },
                customization: {
                    visual: {
                        style: {
                            theme: 'default'
                        }
                    },
                    paymentMethods: {
                        maxInstallments: 12,
                    }
                },
                callbacks: {
                    onReady: () => {
                        console.log('✅ Payment Brick ready!');
                    },
                    onSubmit: async (formData) => {
                        console.log('Payment submitted:', formData);
                        
                        // IMPORTANTE: Aquí debes enviar los datos a tu backend
                        try {
                            // Mostrar mensaje mientras procesa
                            const submitButton = document.querySelector('[data-cy="submit-button-card"]');
                            if (submitButton) {
                                submitButton.disabled = true;
                                submitButton.textContent = 'Processing...';
                            }

                            // TODO: Reemplazar con tu endpoint real
                            // const response = await fetch('/api/process-mercadopago', {
                            //     method: 'POST',
                            //     headers: { 'Content-Type': 'application/json' },
                            //     body: JSON.stringify({
                            //         formData: formData,
                            //         bookingData: bookingData
                            //     })
                            // });
                            // const result = await response.json();

                            // Por ahora, simulamos el pago
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            
                            // Simulación exitosa
                            console.log('✅ Payment successful (simulated)');
                            alert('Payment processing...\n\nIn production, this would send the payment to your backend for processing.');
                            
                            // Descomentar cuando tengas el backend:
                            // if (result.status === 'approved') {
                            //     saveAndRedirectToConfirmation();
                            // } else {
                            //     alert(`Payment ${result.status}. Please try again.`);
                            // }
                            
                            return { success: true };
                        } catch (error) {
                            console.error('Payment error:', error);
                            alert('Error processing payment. Please try again.');
                            return { success: false };
                        }
                    },
                    onError: (error) => {
                        console.error('Payment Brick error:', error);
                    }
                }
            }).then((controller) => {
                paymentBrickController = controller;
                console.log('Payment Brick controller created');
            });

        } catch (error) {
            console.error('Error initializing Mercado Pago:', error);
            container.innerHTML = `
                <div style="padding: 1.5rem; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c33;">
                    <strong>Error:</strong> ${error.message}
                    <br><br>
                    <small>Please check your Mercado Pago configuration.</small>
                </div>
            `;
        }
    }

    // ============================================
    // FUNCIÓN COMÚN PARA REDIRECCIONAR
    // ============================================
    function saveAndRedirectToConfirmation() {
        const finalBookingDetails = {
            id: bookingData.id,
            title: bookingData.title,
            image: bookingData.image,
            date: bookingData.date,
            time: bookingData.time,
            persons: bookingData.persons,
            total: bookingData.total
        };

        sessionStorage.setItem('finalBookingDetails', JSON.stringify(finalBookingDetails));
        sessionStorage.removeItem('checkoutItem');
        
        window.location.href = 'confirmation.html';
    }
});