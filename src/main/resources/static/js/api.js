// API Configuration
// Use current host for API calls (works on any device)
const API_BASE_URL = `${window.location.protocol}//${window.location.host}/api`;

// Get auth token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Get headers with authentication
function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// API request wrapper
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// API Methods
const API = {
    // Auth APIs
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),

    login: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),

    forgotPassword: (email) => apiRequest(`/auth/forgot-password?email=${email}`, {
        method: 'POST'
    }),

    getCurrentUser: () => apiRequest('/auth/me'),

    // User APIs
    getProfile: () => apiRequest('/user/profile'),

    updateProfile: (userData) => apiRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
    }),

    // Emergency Contacts APIs
    getEmergencyContacts: () => apiRequest('/user/emergency-contacts'),

    addEmergencyContact: (contactData) => apiRequest('/user/emergency-contacts', {
        method: 'POST',
        body: JSON.stringify(contactData)
    }),

    updateEmergencyContact: (contactId, contactData) => apiRequest(`/user/emergency-contacts/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify(contactData)
    }),

    deleteEmergencyContact: (contactId) => apiRequest(`/user/emergency-contacts/${contactId}`, {
        method: 'DELETE'
    }),

    // Alert APIs
    createPanicAlert: (alertData) => apiRequest('/alerts/panic', {
        method: 'POST',
        body: JSON.stringify(alertData)
    }),

    getAlertHistory: () => apiRequest('/alerts/history'),

    getAlertById: (alertId) => apiRequest(`/alerts/${alertId}`),

    addLocationTracking: (alertId, latitude, longitude, address) => 
        apiRequest(`/alerts/${alertId}/location?latitude=${latitude}&longitude=${longitude}&address=${address}`, {
            method: 'POST'
        }),

    getLocationHistory: (alertId) => apiRequest(`/alerts/${alertId}/location-history`),

    cancelAlert: (alertId) => apiRequest(`/alerts/${alertId}/cancel`, {
        method: 'PUT'
    }),

    // Upload alert media (photos and audio)
    uploadAlertMedia: async (alertId, mediaData) => {
        const formData = new FormData();
        
        // Add photos
        if (mediaData.photos && mediaData.photos.length > 0) {
            mediaData.photos.forEach((photo, index) => {
                formData.append('photos', photo.blob, `photo_${index}_${Date.now()}.jpg`);
            });
        }
        
        // Add audio
        if (mediaData.audio) {
            formData.append('audio', mediaData.audio, `audio_${Date.now()}.webm`);
        }
        
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/media`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload media');
        }
        
        return await response.json();
    },

    // Unsafe Area APIs
    reportUnsafeArea: (reportData) => apiRequest('/unsafe-areas/report', {
        method: 'POST',
        body: JSON.stringify(reportData)
    }),

    getCommunityReports: () => apiRequest('/unsafe-areas/community'),

    // Admin APIs
    adminLogin: (credentials) => apiRequest('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),

    getDashboardStats: () => apiRequest('/admin/dashboard/stats'),

    getAllUsers: () => apiRequest('/admin/users'),

    blockUser: (userId) => apiRequest(`/admin/users/${userId}/block`, {
        method: 'PUT'
    }),

    unblockUser: (userId) => apiRequest(`/admin/users/${userId}/unblock`, {
        method: 'PUT'
    }),

    deleteUser: (userId) => apiRequest(`/admin/users/${userId}`, {
        method: 'DELETE'
    }),

    getActiveAlerts: () => apiRequest('/admin/alerts'),

    updateAlertStatus: (alertId, status) => apiRequest(`/admin/alerts/${alertId}/status?status=${status}`, {
        method: 'PUT'
    }),

    getPendingReports: () => apiRequest('/admin/reports'),

    updateReportStatus: (reportId, status) => apiRequest(`/admin/reports/${reportId}/status?status=${status}`, {
        method: 'PUT'
    })
};

// Alias for backward compatibility
window.apiCall = apiRequest;
