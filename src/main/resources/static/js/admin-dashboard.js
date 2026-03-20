// Admin Dashboard functionality
checkAuth();

document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboardStats();
    await loadRecentAlerts();
    await loadPendingReports();
});

async function loadDashboardStats() {
    try {
        const stats = await API.getDashboardStats();
        document.getElementById('totalUsers').textContent = stats.totalUsers || '0';
        document.getElementById('activeAlerts').textContent = stats.activeAlerts || '0';
        document.getElementById('pendingReports').textContent = stats.pendingReports || '0';
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

async function loadRecentAlerts() {
    try {
        const alerts = await API.getActiveAlerts();
        const container = document.getElementById('recentAlerts');
        
        if (alerts.length === 0) {
            container.innerHTML = '<p>No active alerts</p>';
            return;
        }

        container.innerHTML = `
            <table style="width: 100%;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Location</th>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${alerts.slice(0, 5).map(alert => `
                        <tr>
                            <td>#${alert.id}</td>
                            <td>${alert.user?.name || 'N/A'}</td>
                            <td>${alert.location || formatCoordinates(alert.latitude, alert.longitude)}</td>
                            <td>${new Date(alert.createdAt).toLocaleString()}</td>
                            <td>${alert.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Failed to load alerts:', error);
    }
}

async function loadPendingReports() {
    try {
        const reports = await API.getPendingReports();
        const container = document.getElementById('pendingReportsList');
        
        if (reports.length === 0) {
            container.innerHTML = '<p>No pending reports</p>';
            return;
        }

        container.innerHTML = `
            <table style="width: 100%;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Location</th>
                        <th>Risk Level</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    ${reports.slice(0, 5).map(report => `
                        <tr>
                            <td>#${report.id}</td>
                            <td>${report.location || formatCoordinates(report.latitude, report.longitude)}</td>
                            <td>${report.riskLevel}</td>
                            <td>${new Date(report.createdAt).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Failed to load reports:', error);
    }
}
