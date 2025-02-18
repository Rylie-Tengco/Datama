// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login if not on login or signup page
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'customer-login.html';
        }
    }
    return token;
}

// Logout functionality
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Update cart count
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cartItems.length;
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add appropriate icon based on type
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Remove notification after animation completes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Handle API errors
function handleError(error) {
    console.error('Error:', error);
    showNotification(error.message || 'An error occurred', 'error');
}

// Load product gallery
async function loadProductGallery(container) {
    try {
        // This would be replaced with actual API call
        const products = [
            {
                id: 1,
                name: 'Product 1',
                price: 99.99,
                image: 'images/product1.jpg',
                description: 'Product description goes here...',
                type: 'sale'
            },
            // Add more products...
        ];

        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">${formatCurrency(product.price)}</p>
                    <p class="type">For ${product.type}</p>
                    <p class="description">${product.description}</p>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        handleError(error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Load product gallery on index page
    const productGallery = document.querySelector('.product-gallery');
    if (productGallery) {
        loadProductGallery(productGallery);
    }
}); 