// Handle owner login
async function validateOwnerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // This would be replaced with actual API call
        // For demo, we'll check for a specific owner account
        if (email === 'romel@ryliedatama.com' && password === 'owner123') {
            const response = {
                token: 'owner_token',
                user: {
                    id: 1,
                    name: 'Romel Gravidez',
                    email: email,
                    role: 'owner'
                }
            };

            // Store auth data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Redirect to owner dashboard
            window.location.href = 'owner-dashboard.html';
        } else {
            showNotification('Invalid email or password', 'error');
        }
    } catch (error) {
        handleError(error);
    }
}

// Validate form inputs
function validateForm() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    // Email validation
    if (!email.value.trim() || !validateEmail(email.value)) {
        email.classList.add('error');
        isValid = false;
    } else {
        email.classList.remove('error');
    }

    // Password validation
    if (!password.value.trim()) {
        password.classList.add('error');
        isValid = false;
    } else {
        password.classList.remove('error');
    }

    return isValid;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ownerLoginForm');
    
    // Add form submission handler
    form.addEventListener('submit', (e) => {
        if (!validateForm()) {
            e.preventDefault();
            showNotification('Please fill in all fields correctly', 'error');
            return;
        }
        validateOwnerLogin(e);
    });

    // Add input validation on blur
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
    });
}); 