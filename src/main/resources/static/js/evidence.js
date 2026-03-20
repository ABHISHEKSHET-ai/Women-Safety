// Evidence Management
let allEvidence = [];
let filteredEvidence = [];

// Load evidence on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Evidence page loaded');
    console.log('Is logged in:', isLoggedIn());
    console.log('Token:', localStorage.getItem('token'));
    console.log('User ID:', localStorage.getItem('userId'));
    
    if (!isLoggedIn()) {
        console.warn('User not logged in, redirecting...');
        document.getElementById('noEvidence').innerHTML = `
            <h3>🔒 Authentication Required</h3>
            <p>Please login to view evidence.</p>
            <a href="login.html" class="btn-primary">🔑 Login</a>
        `;
        document.getElementById('noEvidence').style.display = 'block';
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    loadEvidence();
});

// Load all evidence
async function loadEvidence() {
    try {
        showLoading(true);
        
        console.log('Loading evidence...');
        const response = await apiCall('/alerts/evidence/all', {
            method: 'GET'
        });

        console.log('Evidence response:', response);
        
        if (response) {
            allEvidence = response;
            filteredEvidence = response;
            displayEvidence(response);
            updateStats(response);
            populateAlertFilter(response);
        } else {
            console.warn('No evidence data received');
            document.getElementById('noEvidence').style.display = 'block';
        }
        
        showLoading(false);
    } catch (error) {
        console.error('Error loading evidence:', error);
        showLoading(false);
        
        // Show more specific error
        if (error.message && error.message.includes('401')) {
            showError('Please login to view evidence');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showError('Failed to load evidence: ' + (error.message || 'Unknown error'));
        }
        
        document.getElementById('noEvidence').style.display = 'block';
    }
}

// Display evidence cards
async function displayEvidence(evidenceList) {
    const grid = document.getElementById('evidenceGrid');
    const noEvidence = document.getElementById('noEvidence');
    
    if (!evidenceList || evidenceList.length === 0) {
        grid.style.display = 'none';
        noEvidence.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noEvidence.style.display = 'none';
    
    // Group evidence by alert
    const groupedByAlert = {};
    evidenceList.forEach(evidence => {
        const alertId = evidence.alertId;
        if (!groupedByAlert[alertId]) {
            groupedByAlert[alertId] = [];
        }
        groupedByAlert[alertId].push(evidence);
    });
    
    grid.innerHTML = '';
    
    // Create cards for each alert's evidence
    for (const alertId of Object.keys(groupedByAlert)) {
        const alertEvidence = groupedByAlert[alertId];
        const card = await createEvidenceCard(alertId, alertEvidence);
        grid.appendChild(card);
    }
}

// Create evidence card
async function createEvidenceCard(alertId, evidenceList) {
    const card = document.createElement('div');
    card.className = 'evidence-card';
    
    const firstEvidence = evidenceList[0];
    const images = evidenceList.filter(e => e.mediaType === 'IMAGE');
    const audio = evidenceList.filter(e => e.mediaType === 'AUDIO');
    const video = evidenceList.filter(e => e.mediaType === 'VIDEO');
    
    card.innerHTML = `
        <div class="evidence-header">
            <h3>Alert #${alertId}</h3>
            <p>${new Date(firstEvidence.createdAt).toLocaleString()}</p>
        </div>
        <div class="evidence-content">
            <div class="evidence-media" id="media-${alertId}">
                ${images.length > 0 ? `
                    <img id="img-${images[0].id}" 
                         alt="Evidence Photo" 
                         style="cursor: pointer;"
                         onclick="viewMedia(${images[0].id}, '${images[0].mediaType}')">
                    ${images.length > 1 ? `<p style="font-size: 12px; color: #666; margin-top: 5px;">+${images.length - 1} more photos</p>` : ''}
                ` : ''}
                ${audio.length > 0 ? `
                    <audio id="audio-${audio[0].id}" controls style="width: 100%;">
                        Your browser does not support the audio element.
                    </audio>
                ` : ''}
            </div>
            <div class="evidence-info">
                <div>
                    ${images.length > 0 ? `<span class="evidence-type type-image">📷 ${images.length} Photo${images.length > 1 ? 's' : ''}</span> ` : ''}
                    ${audio.length > 0 ? `<span class="evidence-type type-audio">🎤 ${audio.length} Audio</span> ` : ''}
                    ${video.length > 0 ? `<span class="evidence-type type-video">🎥 ${video.length} Video</span>` : ''}
                </div>
            </div>
            <div class="evidence-actions">
                <button class="btn-view" onclick="viewAllEvidence(${alertId})">
                    👁️ View All
                </button>
                <button class="btn-download" onclick="downloadEvidence(${alertId})">
                    ⬇️ Download
                </button>
            </div>
        </div>
    `;
    
    // Load images with authentication
    if (images.length > 0) {
        loadAuthenticatedImage(images[0].id);
    }
    
    // Load audio with authentication
    if (audio.length > 0) {
        loadAuthenticatedAudio(audio[0].id);
    }
    
    return card;
}

// Load image with JWT token
async function loadAuthenticatedImage(evidenceId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.location.origin}/api/alerts/evidence/${evidenceId}/view`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const img = document.getElementById(`img-${evidenceId}`);
            if (img) {
                img.src = url;
            }
        }
    } catch (error) {
        console.error('Error loading image:', error);
    }
}

// Load audio with JWT token
async function loadAuthenticatedAudio(evidenceId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.location.origin}/api/alerts/evidence/${evidenceId}/view`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = document.getElementById(`audio-${evidenceId}`);
            if (audio) {
                const source = document.createElement('source');
                source.src = url;
                source.type = 'audio/webm';
                audio.appendChild(source);
                audio.load();
            }
        }
    } catch (error) {
        console.error('Error loading audio:', error);
    }
}

// Update statistics
function updateStats(evidenceList) {
    const images = evidenceList.filter(e => e.mediaType === 'IMAGE');
    const audio = evidenceList.filter(e => e.mediaType === 'AUDIO');
    const uniqueAlerts = new Set(evidenceList.map(e => e.alertId));
    
    document.getElementById('totalEvidence').textContent = evidenceList.length;
    document.getElementById('totalImages').textContent = images.length;
    document.getElementById('totalAudio').textContent = audio.length;
    document.getElementById('totalAlerts').textContent = uniqueAlerts.size;
}

// Populate alert filter dropdown
function populateAlertFilter(evidenceList) {
    const alertFilter = document.getElementById('filterAlert');
    const uniqueAlerts = [...new Set(evidenceList.map(e => e.alertId))];
    
    alertFilter.innerHTML = '<option value="all">All Alerts</option>';
    uniqueAlerts.forEach(alertId => {
        const option = document.createElement('option');
        option.value = alertId;
        option.textContent = `Alert #${alertId}`;
        alertFilter.appendChild(option);
    });
}

// Filter evidence
function filterEvidence() {
    const typeFilter = document.getElementById('filterType').value;
    const alertFilter = document.getElementById('filterAlert').value;
    const searchText = document.getElementById('searchBox').value.toLowerCase();
    
    filteredEvidence = allEvidence.filter(evidence => {
        const matchesType = typeFilter === 'all' || evidence.mediaType === typeFilter;
        const matchesAlert = alertFilter === 'all' || evidence.alertId.toString() === alertFilter;
        const matchesSearch = searchText === '' || 
                            evidence.fileName.toLowerCase().includes(searchText) ||
                            evidence.alertId.toString().includes(searchText);
        
        return matchesType && matchesAlert && matchesSearch;
    });
    
    displayEvidence(filteredEvidence);
    updateStats(filteredEvidence);
}

// View single media in modal
async function viewMedia(evidenceId, mediaType) {
    const modal = document.getElementById('mediaModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = '<p style="color: white; text-align: center;">Loading...</p>';
    modal.style.display = 'block';
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.location.origin}/api/alerts/evidence/${evidenceId}/view`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            if (mediaType === 'IMAGE') {
                content.innerHTML = `<img src="${url}" alt="Evidence Photo">`;
            } else if (mediaType === 'AUDIO') {
                content.innerHTML = `
                    <audio controls autoplay style="width: 100%;">
                        <source src="${url}" type="audio/webm">
                    </audio>
                `;
            } else if (mediaType === 'VIDEO') {
                content.innerHTML = `
                    <video controls autoplay style="width: 100%;">
                        <source src="${url}" type="video/webm">
                    </video>
                `;
            }
        } else {
            content.innerHTML = '<p style="color: red; text-align: center;">Failed to load media</p>';
        }
    } catch (error) {
        console.error('Error loading media:', error);
        content.innerHTML = '<p style="color: red; text-align: center;">Error loading media</p>';
    }
}

// View all evidence for an alert
async function viewAllEvidence(alertId) {
    const alertEvidence = allEvidence.filter(e => e.alertId === alertId);
    
    if (alertEvidence.length === 0) return;
    
    const modal = document.getElementById('mediaModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `<h2 style="color: white; text-align: center; margin-bottom: 20px;">Alert #${alertId} Evidence</h2><p style="color: white; text-align: center;">Loading...</p>`;
    modal.style.display = 'block';
    
    let html = `<h2 style="color: white; text-align: center; margin-bottom: 20px;">Alert #${alertId} Evidence</h2>`;
    
    try {
        const token = localStorage.getItem('token');
        
        for (let i = 0; i < alertEvidence.length; i++) {
            const evidence = alertEvidence[i];
            
            const response = await fetch(`${window.location.origin}/api/alerts/evidence/${evidence.id}/view`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                
                if (evidence.mediaType === 'IMAGE') {
                    html += `
                        <div style="margin-bottom: 20px;">
                            <p style="color: white; text-align: center;">Photo ${i + 1}</p>
                            <img src="${url}" alt="Evidence Photo" style="margin-bottom: 20px;">
                        </div>
                    `;
                } else if (evidence.mediaType === 'AUDIO') {
                    html += `
                        <div style="margin-bottom: 20px;">
                            <p style="color: white; text-align: center;">Audio Recording ${i + 1}</p>
                            <audio controls style="width: 100%; margin-bottom: 20px;">
                                <source src="${url}" type="audio/webm">
                            </audio>
                        </div>
                    `;
                }
            }
        }
        
        content.innerHTML = html;
    } catch (error) {
        console.error('Error loading evidence:', error);
        content.innerHTML += '<p style="color: red; text-align: center;">Error loading some evidence</p>';
    }
}

// Download evidence
async function downloadEvidence(alertId) {
    try {
        const alertEvidence = allEvidence.filter(e => e.alertId === alertId);
        
        for (const evidence of alertEvidence) {
            const link = document.createElement('a');
            link.href = `/api/alerts/evidence/${evidence.id}/download`;
            link.download = evidence.fileName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Small delay between downloads
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        showSuccess(`Downloaded ${alertEvidence.length} file(s)`);
    } catch (error) {
        console.error('Error downloading evidence:', error);
        showError('Failed to download evidence');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('mediaModal');
    modal.style.display = 'none';
}

// Show loading indicator
function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
}

// Show error message
function showError(message) {
    // Create a better error display
    const noEvidence = document.getElementById('noEvidence');
    noEvidence.innerHTML = `
        <h3>⚠️ Error</h3>
        <p>${message}</p>
        <button class="btn-primary" onclick="loadEvidence()">🔄 Retry</button>
    `;
    noEvidence.style.display = 'block';
    
    // Also show in console
    console.error(message);
}

// Show success message
function showSuccess(message) {
    alert(message);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('mediaModal');
    if (event.target === modal) {
        closeModal();
    }
}
