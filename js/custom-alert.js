/**
 * Custom Alert System - Beautiful pearl/white styled cards
 * Replaces native browser alert() with styled modal cards
 */
function showCustomAlert(message, type = 'info', title = '') {
    const overlay = document.getElementById('custom-alert-overlay');
    const card = document.getElementById('custom-alert-card');
    const icon = document.getElementById('custom-alert-icon');
    const titleEl = document.getElementById('custom-alert-title');
    const messageEl = document.getElementById('custom-alert-message');
    const button = document.getElementById('custom-alert-button');

    // Set icon and title based on type
    let iconChar = '✓';
    let defaultTitle = 'Notificación';
    
    // Remove previous type classes
    card.classList.remove('custom-alert-success', 'custom-alert-error', 'custom-alert-warning', 'custom-alert-info');
    
    if (type === 'success') {
        iconChar = '✓';
        defaultTitle = '¡Éxito!';
        card.classList.add('custom-alert-success');
    } else if (type === 'error') {
        iconChar = '✕';
        defaultTitle = 'Error';
        card.classList.add('custom-alert-error');
    } else if (type === 'warning') {
        iconChar = '⚠';
        defaultTitle = 'Atención';
        card.classList.add('custom-alert-warning');
    } else if (type === 'info') {
        iconChar = 'ℹ';
        defaultTitle = 'Información';
        card.classList.add('custom-alert-info');
    }

    icon.textContent = iconChar;
    titleEl.textContent = title || defaultTitle;
    messageEl.textContent = message;

    // Show overlay
    overlay.style.display = 'flex';

    // Button click handler
    const closeAlert = () => {
        overlay.style.display = 'none';
        button.removeEventListener('click', closeAlert);
        overlay.removeEventListener('click', outsideClickHandler);
    };

    // Close on button click
    button.addEventListener('click', closeAlert);

    // Close on overlay click (outside card)
    const outsideClickHandler = (e) => {
        if (e.target === overlay) {
            closeAlert();
        }
    };
    overlay.addEventListener('click', outsideClickHandler);
}

// Override native alert function
window.alert = function(message) {
    // Determine alert type based on message content
    let type = 'info';
    let title = '';

    if (message.includes('✅') || message.includes('Completadas') || message.includes('exitoso') || message.includes('agregada')) {
        type = 'success';
        title = '¡Éxito!';
    } else if (message.includes('❌') || message.includes('Error')) {
        type = 'error';
        title = 'Error';
    } else if (message.includes('⚠️') || message.includes('Atención') || message.includes('Debes')) {
        type = 'warning';
        title = 'Atención';
    }

    showCustomAlert(message, type, title);
};
