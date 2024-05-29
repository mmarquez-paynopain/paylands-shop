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
            const productPrice = parseInt(button.dataset.price);
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

    continueButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.querySelector('main').style.display = 'none';
        checkoutSection.classList.remove('hidden');
        renderCartItems();
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

    payButton.addEventListener('click',  () => {
        const paymentMethod = document.getElementById('payment-method').value;
        const environment = document.getElementById('env-select').value;

        const orderURL = environment === "PRODUCTION"
            ? "https://demo-ws-paylands.paynopain.com/v1/payment"
            : "https://demo-ws-paylands.paynopain.com/v1/sandbox/payment";

        const service = environment === "PRODUCTION"
            ? "6284A51B-A423-464C-9F70-28A964266C90"
            : "A53436DB-71E6-43A9-A066-14C89B3400A6";

        const checkout = environment === "PRODUCTION"
            ? ""
            : "619D3A8C-8479-4415-B543-62E59FF08FCB";

        fetch('https://paylands-shop.vercel.app/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "signature": "8fl09JVCO5O31KZmI8sYP7hT",
                "amount": 1,
                "operative": "AUTHORIZATION",
                "secure": true,
                "description": "Checkout SDK Test",
                "service": service,
                "extra_data": {"checkout": {"uuid": checkout}}
            })
        })
            .then(response => response.json())
            .then(data => {
                const token = data.order.token;

                alert(token);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // alert('Compra realizada con éxito!');
        // location.reload();
    });

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});