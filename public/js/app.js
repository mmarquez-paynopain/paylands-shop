document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const continueButton = document.getElementById('continue-button');
    const checkoutSection = document.getElementById('checkout');
    const cartItemsList = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    const payButton = document.getElementById('pay-button');

    let cart = [];

    const products = [
        { id: 1, name: 'Producto 1', price: 1 },
        { id: 2, name: 'Producto 2', price: 2 },
        { id: 3, name: 'Producto 3', price: 3 },
        { id: 4, name: 'Producto 4', price: 4 },
        { id: 5, name: 'Producto 5', price: 5 },
        { id: 6, name: 'Producto 6', price: 6 },
        { id: 7, name: 'Producto 7', price: 7 },
        { id: 8, name: 'Producto 8', price: 8 },
    ];

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.id);
            const product = products.find(p => p.id === productId);

            cart.push(product);
            cartCount.innerText = cart.length;

            showToast();
        });
    });

    function showToast() {
        const toast = document.getElementById('toast');
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    cartButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('payment-method').addEventListener('change', function() {
        document.querySelectorAll('.config_form').forEach(configForm => {
            configForm.style.display = 'none';
        });

        document.getElementById(this.value + '_form').style.display = 'flex';
    });

    continueButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.querySelector('main').style.display = 'none';
        checkoutSection.classList.remove('hidden');

        renderCartItems();

        fetch('/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "signature": "8fl09JVCO5O31KZmI8sYP7hT",
                "amount": parseFloat(totalAmount.innerText) * 100,
                "operative": "AUTHORIZATION",
                "secure": true,
                "description": "Checkout SDK Test",
                "service": "A53436DB-71E6-43A9-A066-14C89B3400A6",
                "extra_data": {"checkout": {"uuid": "619D3A8C-8479-4415-B543-62E59FF08FCB"}}
            })
        })
            .then(response => response.json())
            .then(async data => {
                document.getElementById('payment-iframe').innerHTML = "";

                const paylandsCheckout = await PaylandsCheckout.create({
                    token: data.order.token,
                    environment: "SANDBOX",
                    mode: "DEMO"
                });

                const paymentMethod = document.getElementById('payment-method').value;

                if (paymentMethod === "redirect") {
                    await paylandsCheckout.redirect();
                } else if (paymentMethod === "render") {
                    await paylandsCheckout.render('checkout');
                } else if (paymentMethod === "payment_card") {
                    await paylandsCheckout.card({
                        container: "payment-iframe",
                        form: {
                            holderLabel: document.getElementById('holder-label').value,
                            holderError: document.getElementById('holder-error').value,
                            panLabel: document.getElementById('pan-label').value,
                            panError: document.getElementById('pan-error').value,
                            expiryLabel: document.getElementById('expiry-label').value,
                            expiryError: document.getElementById('expiry-error').value,
                            cvvLabel: document.getElementById('cvv-label').value,
                            cvvError: document.getElementById('cvv-error').value,
                        },
                        customization: {
                            font: document.getElementById('font').value,
                            textColor: document.getElementById('text-color').value,
                            backgroundColor: document.getElementById('background-color').value,
                            errorColor: document.getElementById('error-color').value,
                            borderColor: document.getElementById('border-color').value,
                            borderRadius: document.getElementById('border-radius').value,
                            padding: document.getElementById('padding').value,
                            inputTextSize: document.getElementById('input-text-size').value,
                            labelTextSize: document.getElementById('label-text-size').value,
                            iconSize: "20px",
                            iconColor: document.getElementById('icon-color').value,
                        }
                    });

                    document.getElementById('payment-iframe').style.height = "190px";

                    window.addEventListener('message', event => {
                        if (event.data.card_valid === 1) {
                            document.getElementById('pay-button').classList.remove('disabled');
                        }

                        if (event.data.card_valid === 0) {
                            document.getElementById('pay-button').classList.add('disabled');
                        }
                    });

                    document.getElementById('pay-button').addEventListener("click", () => {
                        window.postMessage({ pay: "card" });
                    });
                } else if (paymentMethod === "wallets") {
                    document.getElementById('pay-button').style.display = "none";
                    await paylandsCheckout.google_pay('payment-iframe');
                } else if (paymentMethod === "paypal") {
                    document.getElementById('pay-button').style.display = "none";
                    await paylandsCheckout.payPal({
                        container: 'payment-iframe',
                        form: {
                            prefilledAddress: document.getElementById('prefilled-address').value,
                            prefilledCountry: document.getElementById('prefilled-country').value,
                        },
                        customization: {
                            layout: document.getElementById('layout').value,
                            color: document.getElementById('color').value,
                            label: document.getElementById('label').value,
                            borderRadius: document.getElementById('borderRadius').value,
                        }
                    });
                } else if (paymentMethod === "bizum") {
                    await paylandsCheckout.bizum({
                        container: 'payment-iframe',
                        form: {
                            prefixLabel: document.getElementById('prefix-label').value,
                            prefixError: document.getElementById('prefix-error').value,
                            phoneLabel: document.getElementById('phone-label').value,
                            phoneError: document.getElementById('phone-error').value,
                            prefilledPrefix: document.getElementById('prefilled-prefix').value,
                            prefilledPhone: document.getElementById('prefilled-phone').value,
                        },
                        customization: {
                            font: document.getElementById('bizum-font').value,
                            textColor: document.getElementById('bizum-text-color').value,
                            backgroundColor: document.getElementById('bizum-background-color').value,
                            errorColor: document.getElementById('bizum-error-color').value,
                            borderColor: document.getElementById('bizum-border-color').value,
                            borderRadius: document.getElementById('bizum-border-radius').value,
                            padding: document.getElementById('bizum-padding').value,
                            inputTextSize: document.getElementById('bizum-input-text-size').value,
                            labelTextSize: document.getElementById('bizum-label-text-size').value,
                            iconSize: "20px",
                            iconColor: document.getElementById('bizum-icon-color').value,
                        }
                    });

                    document.getElementById('payment-iframe').style.height = "70px";

                    window.addEventListener('message', event => {
                        if (event.data.bizum_valid === true) {
                            document.getElementById('pay-button').classList.remove('disabled');
                        }

                        if (event.data.bizum_valid === false) {
                            document.getElementById('pay-button').classList.add('disabled');
                        }
                    });

                    document.getElementById('pay-button').addEventListener("click", () => {
                        window.postMessage({ pay: "bizum" });
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        window.addEventListener('message', event => {
            if (event.data.redirect) {
                window.top.location.href = event.data.redirect;
            } else if (event.data.render) {
                document.getElementById('payment-iframe').innerHTML = event.data.render;
                document.getElementById('payment-iframe').style.height = "100%";
                // document.querySelector('form').submit();
            } else if (event.data.error) {
                document.getElementById('payment-iframe').innerHTML = event.data.error;
                document.getElementById('payment-iframe').style.height = "100%";
            }
        });
    });

    function renderCartItems() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.price}€`;
            cartItemsList.appendChild(li);
            total += item.price;
        });

        totalAmount.innerText = total;
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});