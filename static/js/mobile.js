document.addEventListener('DOMContentLoaded', () => {
    // Handle touch events
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const SWIPE_THRESHOLD = 50;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0) {
                // Swipe right - close menu
                document.querySelector('.nav-links')?.classList.remove('active');
            } else {
                // Swipe left - open menu
                document.querySelector('.nav-links')?.classList.add('active');
            }
        }
    }

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        // Adjust heights for chat container
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.style.height = `${window.innerHeight - 60}px`;
        }
    });

    // Prevent zoom on double tap
    document.addEventListener('dblclick', e => {
        e.preventDefault();
    });
});