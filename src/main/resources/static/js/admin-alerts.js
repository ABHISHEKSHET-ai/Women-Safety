// Admin Alerts Management
let currentAlertId = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadAlerts();
    
    document.getElementById('statusFilter').addEventListener('change', loadAlerts);
    document.getElementById('adminLogoutBtn').addEventListener('click', logout);
    
    // Modal close functionality
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('alertModal');
        if (e.target === modal) {
            closeModal();
        }
    });
});

async function loadAlerts() {
    const container = document.getElementById('alertsContainer');
    const statusFilter = document.getElementById('statusFilter').value;
    
    try {
        container.innerHTML = '<p class="loading">Loading alerts...</p>';
        const alerts = await API.getActiveAlerts();
        
        // Filter alerts by status if selected
        const filteredAlerts = statusFilter 
            ? alerts.filter(alert => alert.status === statusFilter)
            : alerts;
        
        if (filteredAlerts.length === 0) {
            container.innerHTML = '<p class="no-data">No alerts found.</p>';
            return;
        }
        
        const table = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredAlerts.map(alert => `
                        <tr>
                            <td>${alert.id}</td>
                            <td>${alert.user ? `${alert.user.name} (ID: ${alert.user.id})` : (alert.userId || 'N/A')}</td>
                            <td><span class="badge badge-danger">PANIC</span></td>
                            <td>${formatLocation(alert.latitude, alert.longitude)}</td>
                            <td>${formatDateTime(alert.createdAt)}</td>
                            <td><span class="badge badge-${getStatusBadge(alert.status)}">${alert.status}</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewAlert(${alert.id})">View</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = table;
    } catch (error) {
        container.innerHTML = `<p class="error-message">Error loading alerts: ${error.message}</p>`;
    }
}

async function viewAlert(alertId) {
    try {
        const alerts = await API.getActiveAlerts();
        const alert = alerts.find(a => a.id === alertId);
        
        if (!alert) {
            showError('Alert not found');
            return;
        }
        
        currentAlertId = alertId;
        
        const detailsHtml = `
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Alert ID:</strong> ${alert.id}
                </div>
                <div class="detail-item">
                    <strong>User:</strong> ${alert.user ? `${alert.user.name} (${alert.user.email})` : (alert.userId || 'N/A')}
                </div>
                <div class="detail-item">
                    <strong>User ID:</strong> ${alert.user ? alert.user.id : (alert.userId || 'N/A')}
                </div>
                <div class="detail-item">
                    <strong>Alert Type:</strong> <span class="badge badge-danger">PANIC</span>
                </div>
                <div class="detail-item">
                    <strong>Status:</strong> <span class="badge badge-${getStatusBadge(alert.status)}">${alert.status}</span>
                </div>
                <div class="detail-item">
                    <strong>Location:</strong> ${alert.latitude}, ${alert.longitude}
                </div>
                <div class="detail-item">
                    <strong>Created:</strong> ${formatDateTime(alert.createdAt)}
                </div>
                ${alert.location ? `
                <div class="detail-item full-width">
                    <strong>Address:</strong> ${alert.location}
                </div>
                ` : ''}
            </div>
        `;
        
        document.getElementById('alertDetails').innerHTML = detailsHtml;
        document.getElementById('alertModal').style.display = 'block';
    } catch (error) {
        showError('Error loading alert details: ' + error.message);
    }
}

async function updateStatus(status) {
    if (!currentAlertId) return;
    
    try {
        await API.updateAlertStatus(currentAlertId, status);
        closeModal();
        loadAlerts();
        showSuccess(`Alert marked as ${status}`);
    } catch (error) {
        showError('Error updating alert status: ' + error.message);
    }
}

function closeModal() {
    document.getElementById('alertModal').style.display = 'none';
    currentAlertId = null;
}

function getAlertTypeBadge(type) {
    const badges = {
        'PANIC': 'danger',
        'EMERGENCY': 'danger',
        'SUSPICIOUS': 'warning',
        'HARASSMENT': 'warning',
        'OTHER': 'info'
    };
    return badges[type] || 'info';
}

function getStatusBadge(status) {
    const badges = {
        'ACTIVE': 'danger',
        'RESOLVED': 'success',
        'FALSE_ALARM': 'warning'
    };
    return badges[status] || 'info';
}

function formatLocation(lat, lng) {
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
}

function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
}
