// Community Feedback functionality
// Public page - no authentication required

let map;
const markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    loadCommunityReports();
});

async function initializeMap() {
    // Initialize map
    map = L.map('communityMap').setView([28.6139, 77.2090], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Get user's current location and center map with marker
    try {
        const location = await getCurrentLocation();
        map.setView([location.latitude, location.longitude], 12);
        
        // Add user's current location marker (blue marker)
        const userMarker = L.marker([location.latitude, location.longitude], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map);
        
        userMarker.bindPopup('<b>Your Current Location</b>').openPopup();
    } catch (error) {
        console.error('Could not get current location:', error);
    }
}

async function loadCommunityReports() {
    const reportsListDiv = document.getElementById('reportsList');
    
    try {
        // Show loading indicator
        reportsListDiv.innerHTML = '<p class="loading">Loading community reports...</p>';
        
        const reports = await API.getCommunityReports();

        // Clear existing markers
        markers.forEach(marker => map.removeLayer(marker));
        markers.length = 0;

        if (reports.length === 0) {
            reportsListDiv.innerHTML = '<p>No approved reports found.</p>';
            return;
        }

        // Add markers to map
        reports.forEach(report => {
            const color = getRiskColor(report.riskLevel);
            
            const marker = L.circleMarker([report.latitude, report.longitude], {
                radius: 10,
                fillColor: color,
                color: color,
                weight: 2,
                opacity: 1,
                fillOpacity: 0.6
            }).addTo(map);

            marker.bindPopup(`
                <b>${report.riskLevel} Risk Area</b><br>
                ${report.location || formatCoordinates(report.latitude, report.longitude)}<br>
                ${report.description}<br>
                <small>Reported: ${new Date(report.createdAt).toLocaleDateString()}</small>
            `);

            markers.push(marker);
        });

        // Display list of recent reports (limit to 10 most recent)
        const recentReports = reports.slice(0, 10);
        reportsListDiv.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 1rem;">Recent Reports (${reports.length} total)</h3>
            ${recentReports.map(report => `
                <div class="report-item" style="border-left: 4px solid ${getRiskColor(report.riskLevel)}; padding: 1rem; margin: 0.5rem 0; background: white; border-radius: 5px;">
                    <h4>${report.riskLevel} Risk</h4>
                    <p>📍 ${report.location || formatCoordinates(report.latitude, report.longitude)}</p>
                    <p>${report.description}</p>
                    <small>Reported: ${new Date(report.createdAt).toLocaleDateString()}</small>
                </div>
            `).join('')}
        `;

    } catch (error) {
        console.error('Failed to load community reports:', error);
        reportsListDiv.innerHTML = '<p class="error-message">Failed to load reports. Please try again.</p>';
    }
}

function getRiskColor(riskLevel) {
    switch (riskLevel) {
        case 'HIGH': return '#dc3545';
        case 'MEDIUM': return '#ffc107';
        case 'LOW': return '#28a745';
        default: return '#6c757d';
    }
}
