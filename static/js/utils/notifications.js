class NotificationManager {
    constructor() {
        this.notifications = [];
    }

    show(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Add to notifications array
        this.notifications.push(notification);
        this.updatePositions();

        // Auto dismiss
        setTimeout(() => this.hide(notification), 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hide(notification);
        });
    }

    hide(notification) {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
            this.notifications = this.notifications.filter(n => n !== notification);
            this.updatePositions();
        }, 300);
    }

    updatePositions() {
        let offset = 20;
        this.notifications.forEach(notification => {
            notification.style.top = offset + 'px';
            offset += notification.offsetHeight + 10;
        });
    }
}

// Create global instance
window.notificationManager = new NotificationManager();