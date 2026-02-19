/**
 * Instagram-style Like Functionality for Images
 * Like/Unlike functionality for facility images
 * Instagram-style animation with heart burst effect
 */
function likeImage(imageWrapper) {
    const heartOverlay = imageWrapper.querySelector('.heart-overlay');
    const isLiked = heartOverlay.classList.contains('liked');
    
    if (isLiked) {
        // Unlike: change back to outline
        heartOverlay.classList.remove('liked');
        heartOverlay.textContent = '♡'; // Outline heart
    } else {
        // Like: fill the heart with animation
        heartOverlay.classList.add('liked');
        heartOverlay.textContent = '♥'; // Filled heart
        
        // Create and show burst animation
        const burst = document.createElement('div');
        burst.className = 'like-burst';
        burst.textContent = '♥';
        imageWrapper.appendChild(burst);
        
        // Remove burst element after animation completes
        setTimeout(() => {
            burst.remove();
        }, 800);
    }
}

/**
 * Toggle Pilates card to show/hide text overlay
 * When clicked, shows text overlay on the image
 * Click again to hide the text
 */
function togglePilatesCard(card) {
    // Close all other cards first
    const allCards = document.querySelectorAll('.pilates-card');
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove('active');
        }
    });
    
    // Toggle current card
    card.classList.toggle('active');
}
