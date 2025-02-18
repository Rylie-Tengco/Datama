// Switch between login and signup forms
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginBtn = document.querySelector('[onclick="switchTab(\'login\')"]');
    const signupBtn = document.querySelector('[onclick="switchTab(\'signup\')"]');

    if (tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
    } else {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
        loginBtn.classList.remove('active');
        signupBtn.classList.add('active');
    }
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // This would be replaced with actual API call
        // For demo, we'll simulate a successful login
        const response = {
            token: 'dummy_token',
            user: {
                id: 1,
                name: 'John Doe',
                email: email,
                role: 'customer'
            }
        };

        // Store auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Redirect to shop page
        window.location.href = 'shop.html';
    } catch (error) {
        handleError(error);
    }
}

// Handle signup form submission
async function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const phone = document.getElementById('signupPhone').value;
    const address = document.getElementById('signupAddress').value;

    try {
        // This would be replaced with actual API call
        // For demo, we'll simulate a successful registration
        const response = {
            token: 'dummy_token',
            user: {
                id: 1,
                name: name,
                email: email,
                phone: phone,
                address: address,
                role: 'customer'
            }
        };

        // Store auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Show success message
        showNotification('Registration successful! Redirecting to shop...');

        // Redirect to shop page after a short delay
        setTimeout(() => {
            window.location.href = 'shop.html';
        }, 1500);
    } catch (error) {
        handleError(error);
    }
}

// Validate form inputs
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }

        // Email validation
        if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            input.classList.add('error');
        }

        // Phone validation
        if (input.type === 'tel' && !validatePhone(input.value)) {
            isValid = false;
            input.classList.add('error');
        }
    });

    return isValid;
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation
function validatePhone(phone) {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add input validation on blur
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
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
}); 