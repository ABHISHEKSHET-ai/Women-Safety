// Report Unsafe Area functionality
checkAuth();

let map, marker;
let selectedLocation = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupForm();
});

async function initializeMap() {
    // Initialize map centered on default location
    map = L.map('reportMap').setView([28.6139, 77.2090], 13); // Default: New Delhi

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Get user's current location and set initial marker
    try {
        const location = await getCurrentLocation();
        map.setView([location.latitude, location.longitude], 15);
        
        // Add marker at current location
        marker = L.marker([location.latitude, location.longitude]).addTo(map);
        selectedLocation = { latitude: location.latitude, longitude: location.longitude };
        document.getElementById('latitude').value = location.latitude;
        document.getElementById('longitude').value = location.longitude;
        
        // Get address
        const address = await reverseGeocode(location.latitude, location.longitude);
        document.getElementById('selectedLocation').textContent = address;
    } catch (error) {
        console.error('Could not get current location:', error);
    }

    // Click on map to select different location
    map.on('click', async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Remove existing marker
        if (marker) {
            map.removeLayer(marker);
        }

        // Add new marker
        marker = L.marker([lat, lng]).addTo(map);

        // Update selected location
        selectedLocation = { latitude: lat, longitude: lng };
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;

        // Get address
        const address = await reverseGeocode(lat, lng);
        document.getElementById('selectedLocation').textContent = address;
    });
}

function setupForm() {
    const form = document.getElementById('reportForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!selectedLocation) {
            showError('reportError', 'Please select a location on the map');
            return;
        }

        const reportData = {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            location: document.getElementById('selectedLocation').textContent,
            description: document.getElementById('description').value,
            riskLevel: document.getElementById('riskLevel').value
        };

        try {
            await API.reportUnsafeArea(reportData);
            showSuccess('reportSuccess', 'Report submitted successfully! It will be reviewed by admins.');
            
            // Reset form
            form.reset();
            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }
            selectedLocation = null;
            document.getElementById('selectedLocation').textContent = 'Click on the map to select location';

        } catch (error) {
            showError('reportError', error.message || 'Failed to submit report');
        }
    });
}
