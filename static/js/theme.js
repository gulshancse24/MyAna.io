const Theme = {
    LIGHT: 'light',
    DARK: 'dark',
    
    init() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        this.loadTheme();
        this.bindEvents();
    },

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || this.LIGHT;
        this.applyTheme(savedTheme);
    },

    bindEvents() {
        this.themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === this.DARK 
                ? this.LIGHT 
                : this.DARK;
            this.applyTheme(newTheme);
        });
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateIcon(theme);
        this.updateColors(theme);
    },

    updateIcon(theme) {
        this.themeIcon.className = theme === this.DARK 
            ? 'fas fa-sun' 
            : 'fas fa-moon';
    },

    updateColors(theme) {
        const colors = theme === this.DARK ? this.darkColors : this.lightColors;
        Object.entries(colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    },

    lightColors: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f8fafc',
        '--text-primary': '#2d3748',
        '--text-secondary': '#4a5568',
        '--border-color': '#e2e8f0',
        '--navbar-bg': 'rgba(255, 255, 255, 0.95)',
        '--card-bg': '#ffffff',
        '--shadow-color': 'rgba(0, 0, 0, 0.1)'
    },

    darkColors: {
        '--bg-primary': '#1a202c',
        '--bg-secondary': '#2d3748',
        '--text-primary': '#f7fafc',
        '--text-secondary': '#e2e8f0',
        '--border-color': '#4a5568',
        '--navbar-bg': 'rgba(26, 32, 44, 0.95)',
        '--card-bg': '#2d3748',
        '--shadow-color': 'rgba(0, 0, 0, 0.3)'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('themeSelect');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'purple';
    themeSelect.value = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Handle theme change
    themeSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('theme', selectedTheme);
        
        // Add animation effect
        document.body.style.transition = 'background-color 0.3s ease';
        
        // Show feedback toast
        showThemeChangeToast(selectedTheme);
    });
});

function showThemeChangeToast(theme) {
    const toast = document.createElement('div');
    toast.className = 'theme-toast';
    toast.innerHTML = `
        <i class="fas fa-palette"></i>
        Theme changed to ${theme}
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}