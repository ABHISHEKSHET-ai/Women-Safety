// Dashboard functionality
checkAuth();

let currentAlertId = null;
let locationMap = null;
let locationMarker = null;
let mediaCapture = null;
let emergencyRecording = null;

document.addEventListener('DOMContentLoaded', async () => {
    const userData = getUserData();
    document.getElementById('userName').textContent = userData.userName;

    // Load emergency contacts
    await loadEmergencyContacts();

    // Load current location
    await loadCurrentLocation();

    // Load recent alerts
    await loadRecentAlerts();

    // Setup panic button
    setupPanicButton();

    // Setup refresh location
    document.getElementById('refreshLocation').addEventListener('click', loadCurrentLocation);
});

async function loadEmergencyContacts() {
    try {
        const contacts = await API.getEmergencyContacts();
        const previewDiv = document.getElementById('contactsPreview');
        
        if (contacts.length === 0) {
            previewDiv.innerHTML = '<p>No emergency contacts added</p>';
        } else {
            previewDiv.innerHTML = `
                <p><strong>${contacts.length}</strong> contact(s) configured</p>
                <ul style="list-style: none; padding: 0;">
                    ${contacts.slice(0, 3).map(c => `<li>📞 ${c.name} - ${c.relation || 'Contact'}</li>`).join('')}
                </ul>
            `;
        }
    } catch (error) {
        console.error('Failed to load contacts:', error);
    }
}

async function loadCurrentLocation() {
    const previewDiv = document.getElementById('locationPreview');
    const refreshBtn = document.getElementById('refreshLocation');
    
    try {
        // Show loading state
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.textContent = 'Loading...';
        }
        previewDiv.innerHTML = '<p class="loading">Getting your location...</p>';
        
        const location = await getCurrentLocation();
        const address = await reverseGeocode(location.latitude, location.longitude);
        
        // Initialize map if not already done
        if (!locationMap) {
            locationMap = L.map('locationMap').setView([location.latitude, location.longitude], 15);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(locationMap);
        }
        
        // Update or create marker
        if (locationMarker) {
            locationMarker.setLatLng([location.latitude, location.longitude]);
        } else {
            locationMarker = L.marker([location.latitude, location.longitude]).addTo(locationMap)
                .bindPopup('<strong>You are here</strong><br>' + address)
                .openPopup();
        }
        
        // Center map on current location
        locationMap.setView([location.latitude, location.longitude], 15);
        
        previewDiv.innerHTML = `
            <p><strong>Coordinates:</strong> ${formatCoordinates(location.latitude, location.longitude)}</p>
            <p><strong>Accuracy:</strong> ±${Math.round(location.accuracy)} meters</p>
            <p><strong>Address:</strong> ${address}</p>
            <p class="success-message">✓ Location updated successfully!</p>
        `;
        
        // Reset button
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.textContent = '🔄 Refresh Location';
        }
    } catch (error) {
        console.error('Location error:', error);
        previewDiv.innerHTML = `<p class="error-message">${error.message}</p>`;
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.textContent = '🔄 Refresh Location';
        }
    }
}

async function loadRecentAlerts() {
    try {
        const alerts = await API.getAlertHistory();
        const alertsDiv = document.getElementById('recentAlerts');
        
        if (alerts.length === 0) {
            alertsDiv.innerHTML = '<p>No alerts found</p>';
        } else {
            alertsDiv.innerHTML = `
                <ul style="list-style: none; padding: 0;">
                    ${alerts.slice(0, 3).map(a => `
                        <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                            🚨 ${new Date(a.createdAt).toLocaleString()} - ${a.status}
                        </li>
                    `).join('')}
                </ul>
            `;
        }
    } catch (error) {
        console.error('Failed to load alerts:', error);
    }
}

function setupPanicButton() {
    const panicButton = document.getElementById('panicButton');
    const panicModal = document.getElementById('panicModal');
    const cancelButton = document.getElementById('cancelAlert');

    panicButton.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to trigger a PANIC ALERT? This will notify all your emergency contacts and start recording.')) {
            return;
        }

        try {
            // Show modal immediately
            panicModal.style.display = 'flex';
            document.getElementById('alertStatus').innerHTML = '<p class="loading">⏳ Getting your location...</p>';
            
            // Get location
            const location = await getCurrentLocation();
            const address = await reverseGeocode(location.latitude, location.longitude);

            // Create alert
            const alertData = {
                latitude: location.latitude,
                longitude: location.longitude,
                location: address
            };

            const alert = await API.createPanicAlert(alertData);
            currentAlertId = alert.id;

            // Update modal
            document.getElementById('alertStatus').innerHTML = `
                <p class="success-message">✅ Alert sent successfully!</p>
                <p>📞 Emergency contacts notified</p>
                <p class="loading">📹 Recording in progress (30 seconds)...</p>
                <p><strong>Location:</strong> ${address}</p>
            `;
            document.getElementById('trackingLink').href = `location-tracking.html?alertId=${alert.id}`;

            // Start emergency recording (camera + audio for 30 seconds)
            try {
                document.getElementById('alertStatus').innerHTML += '<p class="loading">📸 Capturing photos and audio...</p>';
                
                mediaCapture = new MediaCapture();
                emergencyRecording = await mediaCapture.startEmergencyRecording(30);
                
                // Upload media to server
                document.getElementById('alertStatus').innerHTML += '<p class="loading">☁️ Uploading media to server...</p>';
                await API.uploadAlertMedia(alert.id, emergencyRecording);
                
                // Update status
                document.getElementById('alertStatus').innerHTML = `
                    <p class="success-message">✅ Alert Complete!</p>
                    <p>📞 Emergency contacts notified</p>
                    <p>✅ ${emergencyRecording.photos.length} photos captured</p>
                    <p>✅ Audio recorded (${(emergencyRecording.audio.size / 1024).toFixed(2)} KB)</p>
                    <p>✅ Media sent to emergency contacts</p>
                    <p><strong>Location:</strong> ${address}</p>
                `;
                
            } catch (mediaError) {
                console.error('Media capture error:', mediaError);
                document.getElementById('alertStatus').innerHTML += `
                    <p class="error-message">⚠️ ${mediaError.message}</p>
                    <p>Alert was sent but media recording failed.</p>
                `;
            }

        } catch (error) {
            panicModal.style.display = 'none';
            alert('Failed to send panic alert: ' + error.message);
        }
    });

    cancelButton.addEventListener('click', async () => {
        if (currentAlertId && confirm('Are you sure you want to cancel this alert?')) {
            try {
                // Stop any ongoing recording
                if (mediaCapture) {
                    mediaCapture.stopAll();
                }
                
                await API.cancelAlert(currentAlertId);
                panicModal.style.display = 'none';
                showSuccess('successMessage', 'Alert cancelled');
                loadRecentAlerts();
            } catch (error) {
                alert('Failed to cancel alert: ' + error.message);
            }
        }
    });
}
