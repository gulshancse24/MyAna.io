document.addEventListener('DOMContentLoaded', () => {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const settingsBtn = document.getElementById('cookieSettings');
    const modal = document.querySelector('.cookie-settings-modal');
    const closeModal = document.querySelector('.close-modal');
    const savePreferences = document.querySelector('.btn-save-preferences');
    const analyticsCookies = document.getElementById('analyticsCookies');

    // Show cookie consent if not accepted
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 1000);
    }

    // Accept all cookies
    acceptBtn.addEventListener('click', () => {
        setCookiePreferences(true);
        hideCookieConsent();
    });

    // Open settings
    settingsBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Save preferences
    savePreferences.addEventListener('click', () => {
        setCookiePreferences(analyticsCookies.checked);
        modal.classList.remove('show');
        hideCookieConsent();
    });

    function setCookiePreferences(analytics) {
        localStorage.setItem('cookieConsent', 'true');
        localStorage.setItem('analyticsCookies', analytics);
        
        // Initialize analytics if allowed
        if (analytics) {
            initializeAnalytics();
        }
    }

    function hideCookieConsent() {
        cookieConsent.classList.remove('show');
    }

    function initializeAnalytics() {
        // Add your analytics initialization code here
        console.log('Analytics initialized');
    }
});