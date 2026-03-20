// Location Tracking functionality

let map, marker, polyline;
let trackingInterval;
const locationHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const alertId = urlParams.get('alertId');

    if (!alertId) {
        alert('No alert ID provided');
        window.location.href = 'dashboard.html';
        return;
    }

    initializeTracking(alertId);
});

async function initializeTracking(alertId) {
    document.getElementById('alertId').textContent = alertId;

    // Initialize map
    map = L.map('map').setView([28.6139, 77.2090], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Load alert details
    await loadAlertDetails(alertId);

    // Load location history
    await loadLocationHistory(alertId);

    // Start tracking if alert is active
    startLocationTracking(alertId);
}

async function loadAlertDetails(alertId) {
    try {
        const alert = await API.getAlertById(alertId);
        
        document.getElementById('alertTime').textContent = new Date(alert.createdAt).toLocaleString();
        document.getElementById('currentLocation').textContent = alert.location || formatCoordinates(alert.latitude, alert.longitude);

        const statusBadge = document.getElementById('statusBadge');
        statusBadge.textContent = `● ${alert.status}`;
        statusBadge.className = alert.isActive ? 'status-active' : 'status-resolved';

        // Center map on alert location
        map.setView([alert.latitude, alert.longitude], 15);

        // Add initial marker
        marker = L.marker([alert.latitude, alert.longitude])
            .addTo(map)
            .bindPopup('Alert Location')
            .openPopup();

    } catch (error) {
        console.error('Failed to load alert details:', error);
    }
}

async function loadLocationHistory(alertId) {
    try {
        const history = await API.getLocationHistory(alertId);
        const historyDiv = document.getElementById('locationHistory');

        if (history.length === 0) {
            historyDiv.innerHTML = '<p>No location history available</p>';
            return;
        }

        // Display history list
        historyDiv.innerHTML = history.map(loc => `
            <div style="padding: 0.5rem; border-bottom: 1px solid #eee;">
                <p><strong>${new Date(loc.trackedAt).toLocaleTimeString()}</strong></p>
                <p>📍 ${loc.address || formatCoordinates(loc.latitude, loc.longitude)}</p>
            </div>
        `).join('');

        // Draw path on map
        const coordinates = history.map(loc => [loc.latitude, loc.longitude]);
        
        if (polyline) {
            map.removeLayer(polyline);
        }

        polyline = L.polyline(coordinates, {
            color: 'red',
            weight: 3,
            opacity: 0.7
        }).addTo(map);

        // Fit map to show all locations
        if (coordinates.length > 0) {
            map.fitBounds(polyline.getBounds());
        }

    } catch (error) {
        console.error('Failed to load location history:', error);
    }
}

function startLocationTracking(alertId) {
    // Update location every 10 seconds
    trackingInterval = setInterval(async () => {
        try {
            const location = await getCurrentLocation();
            const address = await reverseGeocode(location.latitude, location.longitude);

            // Send location update to server
            await API.addLocationTracking(alertId, location.latitude, location.longitude, address);

            // Update marker position
            if (marker) {
                marker.setLatLng([location.latitude, location.longitude]);
            }

            // Update display
            document.getElementById('currentLocation').textContent = address;

            // Reload history to show new location
            await loadLocationHistory(alertId);

        } catch (error) {
            console.error('Location tracking error:', error);
        }
    }, 10000); // Every 10 seconds
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
    stopWatchingLocation();
});
