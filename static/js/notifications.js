class NotificationManager {
    constructor() {
        this.notifications = new Set();
    }

    show(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
            <button class="close-notification" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);
        this.notifications.add(notification);

        // Handle close button
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => this.hide(notification));

        // Auto dismiss after 5 seconds
        setTimeout(() => this.hide(notification), 5000);

        // Ensure proper stacking of multiple notifications
        this.updatePositions();
    }

    hide(notification) {
        notification.classList.add('hide');
        notification.addEventListener('animationend', () => {
            notification.remove();
            this.notifications.delete(notification);
            this.updatePositions();
        });
    }

    updatePositions() {
        let offset = 20;
        this.notifications.forEach(notif => {
            notif.style.top = offset + 'px';
            offset += notif.offsetHeight + 10;
        });
    }
}

// Create global instance
window.notificationManager = new NotificationManager();