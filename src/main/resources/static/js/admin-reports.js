// Admin Reports Management
let currentReportId = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadReports();
    
    document.getElementById('statusFilter').addEventListener('change', loadReports);
    document.getElementById('adminLogoutBtn').addEventListener('click', logout);
    
    // Modal close functionality
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('reportModal');
        if (e.target === modal) {
            closeModal();
        }
    });
});

async function loadReports() {
    const container = document.getElementById('reportsContainer');
    const statusFilter = document.getElementById('statusFilter').value;
    
    try {
        container.innerHTML = '<p class="loading">Loading reports...</p>';
        const reports = await API.getPendingReports();
        
        // Filter reports by status if selected
        const filteredReports = statusFilter 
            ? reports.filter(report => report.status === statusFilter)
            : reports;
        
        if (filteredReports.length === 0) {
            container.innerHTML = '<p class="no-data">No reports found.</p>';
            return;
        }
        
        const table = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Location</th>
                        <th>Description</th>
                        <th>Reported</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredReports.map(report => `
                        <tr>
                            <td>${report.id}</td>
                            <td>${report.userId}</td>
                            <td>${formatLocation(report.latitude, report.longitude)}</td>
                            <td>${truncate(report.description, 50)}</td>
                            <td>${formatDateTime(report.reportedAt)}</td>
                            <td><span class="badge badge-${getStatusBadge(report.status)}">${report.status}</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewReport(${report.id})">View</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = table;
    } catch (error) {
        container.innerHTML = `<p class="error-message">Error loading reports: ${error.message}</p>`;
    }
}

async function viewReport(reportId) {
    try {
        const reports = await API.getPendingReports();
        const report = reports.find(r => r.id === reportId);
        
        if (!report) {
            showError('Report not found');
            return;
        }
        
        currentReportId = reportId;
        
        const detailsHtml = `
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Report ID:</strong> ${report.id}
                </div>
                <div class="detail-item">
                    <strong>User ID:</strong> ${report.userId}
                </div>
                <div class="detail-item">
                    <strong>Status:</strong> <span class="badge badge-${getStatusBadge(report.status)}">${report.status}</span>
                </div>
                <div class="detail-item">
                    <strong>Location:</strong> ${report.latitude}, ${report.longitude}
                </div>
                <div class="detail-item">
                    <strong>Reported:</strong> ${formatDateTime(report.reportedAt)}
                </div>
                <div class="detail-item full-width">
                    <strong>Description:</strong>
                    <p>${report.description}</p>
                </div>
            </div>
        `;
        
        document.getElementById('reportDetails').innerHTML = detailsHtml;
        document.getElementById('reportModal').style.display = 'block';
    } catch (error) {
        showError('Error loading report details: ' + error.message);
    }
}

async function updateReportStatus(status) {
    if (!currentReportId) return;
    
    try {
        await API.updateReportStatus(currentReportId, status);
        closeModal();
        loadReports();
        showSuccess(`Report ${status.toLowerCase()}`);
    } catch (error) {
        showError('Error updating report status: ' + error.message);
    }
}

function closeModal() {
    document.getElementById('reportModal').style.display = 'none';
    currentReportId = null;
}

function getStatusBadge(status) {
    const badges = {
        'PENDING': 'warning',
        'APPROVED': 'success',
        'REJECTED': 'danger'
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

function truncate(str, maxLength) {
    if (!str) return '-';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
}
