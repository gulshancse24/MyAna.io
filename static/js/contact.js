document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    // Initialize notification manager if not exists
    if (!window.notificationManager) {
        class NotificationManager {
            show(message, type = 'success') {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.innerHTML = `
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                    <p>${message}</p>
                    <button class="close-notification">
                        <i class="fas fa-times"></i>
                    </button>
                `;

                document.body.appendChild(notification);
                
                const closeBtn = notification.querySelector('.close-notification');
                closeBtn.addEventListener('click', () => notification.remove());
                
                setTimeout(() => notification.remove(), 5000);
            }
        }
        window.notificationManager = new NotificationManager();
    }

    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            subject: contactForm.subject.value,
            message: contactForm.message.value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                window.notificationManager.show('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                window.notificationManager.show(data.message || 'Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            window.notificationManager.show('An error occurred. Please try again later.', 'error');
        }
    });
});