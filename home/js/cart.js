// Check authentication
if (!checkAuth()) {
    window.location.href = 'customer-login.html';
}

let cart = [];

// Load cart items
function loadCart() {
    try {
        cart = JSON.parse(localStorage.getItem('cart') || '[]');
        renderCart();
        updateCartCount();
    } catch (error) {
        handleError(error);
    }
}

// Render cart items
function renderCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartContent = document.querySelector('.cart-content');

    if (!cart || cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="shop.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">${formatCurrency(item.price)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-product-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-product-id="${item.id}">
                    <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-product-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateCartSummary();
    addCartEventListeners();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0; // Example shipping cost
    const total = subtotal + shipping;

    document.querySelector('.subtotal').textContent = formatCurrency(subtotal);
    document.querySelector('.shipping').textContent = formatCurrency(shipping);
    document.querySelector('.total-amount').textContent = formatCurrency(total);

    // Update checkout button state
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// Add event listeners to cart items
function addCartEventListeners() {
    // Quantity decrease buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.productId);
            updateQuantity(productId, 'decrease');
        });
    });

    // Quantity increase buttons
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.productId);
            updateQuantity(productId, 'increase');
        });
    });

    // Quantity input fields
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = parseInt(input.dataset.productId);
            const newQuantity = parseInt(e.target.value);
            if (newQuantity > 0) {
                updateQuantity(productId, 'set', newQuantity);
            } else {
                loadCart(); // Reset to previous value
            }
        });
    });

    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.productId);
            removeFromCart(productId);
        });
    });
}

// Update item quantity
function updateQuantity(productId, action, value = null) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    switch (action) {
        case 'increase':
            cart[itemIndex].quantity += 1;
            break;
        case 'decrease':
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            }
            break;
        case 'set':
            cart[itemIndex].quantity = value;
            break;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    showNotification('Cart updated successfully');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    showNotification('Item removed from cart');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    // Handle checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
}); 