// Alert History functionality
checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    loadAlertHistory();
});

async function loadAlertHistory() {
    const listDiv = document.getElementById('alertsList');
    
    try {
        // Show loading indicator
        listDiv.innerHTML = '<p class="loading">Loading alert history...</p>';
        
        const alerts = await API.getAlertHistory();

        if (alerts.length === 0) {
            listDiv.innerHTML = '<p>No alerts found.</p>';
            return;
        }

        listDiv.innerHTML = alerts.map(alert => `
            <div class="alert-item">
                <div>
                    <h3>Alert #${alert.id}</h3>
                    <p>📅 ${new Date(alert.createdAt).toLocaleString()}</p>
                    <p>📍 ${alert.location || formatCoordinates(alert.latitude, alert.longitude)}</p>
                    <p>Status: <span class="status-${alert.status.toLowerCase()}">${alert.status}</span></p>
                </div>
                <div>
                    <a href="location-tracking.html?alertId=${alert.id}" class="btn btn-secondary btn-sm">View Details</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load alerts:', error);
        listDiv.innerHTML = '<p class="error-message">Failed to load alert history. Please try again.</p>';
    }
}
