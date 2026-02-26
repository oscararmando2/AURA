/**
 * Page Loader Script
 * Hide loader after 3 seconds on page load or refresh
 */
window.addEventListener('load', function() {
    setTimeout(function() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            // Add fade-out class
            loader.classList.add('fade-out');
            
            // Remove from DOM after fade-out animation completes
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500); // Match the CSS transition duration
        }
    }, 3000); // 3 seconds delay
});
