class ConnectionMonitor {
    constructor() {
        this.status = document.getElementById('connectionStatus');
        this.checkInterval = 30000; // Check every 30 seconds
        this.startMonitoring();
    }

    async checkConnection() {
        try {
            const response = await fetch('/api/health-check');
            if (response.ok) {
                this.updateStatus('connected');
            } else {
                this.updateStatus('disconnected');
            }
        } catch (error) {
            this.updateStatus('disconnected');
        }
    }

    updateStatus(status) {
        if (status === 'connected') {
            this.status.innerHTML = '<span class="status-dot connected"></span> Connected';
        } else {
            this.status.innerHTML = '<span class="status-dot disconnected"></span> Reconnecting...';
        }
    }

    startMonitoring() {
        this.checkConnection();
        setInterval(() => this.checkConnection(), this.checkInterval);
    }
}

new ConnectionMonitor();