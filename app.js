/**
 * AURA STUDIO - Client-side JavaScript
 * Handles form submissions and user interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuthStatus();

    // Handle registration form
    const registerForm = document.querySelector('form[action="/register"]');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }

    // Handle login form
    const loginForm = document.querySelector('form[action="/login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Check if user is authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch('/auth/status');
        const data = await response.json();
        
        if (data.authenticated) {
            updateUIForAuthenticatedUser(data.username);
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser(username) {
    const loginLink = document.querySelector('nav a[href="#login"]');
    if (loginLink) {
        loginLink.textContent = `Hola, ${username}`;
        loginLink.href = '#';
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Deseas cerrar sesión?')) {
                handleLogout();
            }
        });
    }
}

// Handle registration
async function handleRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Client-side validation
    if (!data.username || !data.email || !data.password) {
        showMessage('Todos los campos son requeridos', 'error');
        return;
    }

    if (data.password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Email inválido', 'error');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            form.reset();
            setTimeout(() => {
                if (result.redirect) {
                    window.location.href = result.redirect;
                }
            }, 1500);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Error al registrar usuario. Por favor, intenta de nuevo.', 'error');
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Client-side validation
    if (!data.username || !data.password) {
        showMessage('Usuario y contraseña son requeridos', 'error');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            form.reset();
            setTimeout(() => {
                if (result.redirect) {
                    window.location.href = result.redirect;
                }
            }, 1500);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Error al iniciar sesión. Por favor, intenta de nuevo.', 'error');
    }
}

// Handle logout
async function handleLogout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST'
        });

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('Error al cerrar sesión. Por favor, intenta de nuevo.', 'error');
    }
}

// Show message to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-popup ${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1.5rem 2rem;
        background-color: ${type === 'success' ? '#000' : '#ff0000'};
        color: white;
        border-radius: 0;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
        letter-spacing: 1px;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(messageDiv);

    // Remove after 4 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 4000);
}

// MercadoPago callback handler
function $MPC_message(event) {
    if (event.data && event.data.preapproval_id) {
        // Save subscription information
        fetch('/subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                preapproval_id: event.data.preapproval_id,
                status: 'active'
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showMessage('¡Suscripción exitosa! Bienvenido a AURA STUDIO.', 'success');
            }
        })
        .catch(error => {
            console.error('Error saving subscription:', error);
        });
    }
}

// Listen for MercadoPago messages
if (window.addEventListener) {
    window.addEventListener("message", $MPC_message);
}
