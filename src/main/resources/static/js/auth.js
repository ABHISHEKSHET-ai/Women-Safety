// Authentication utilities

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Save auth data
function saveAuthData(authResponse) {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('userId', authResponse.userId);
    localStorage.setItem('userName', authResponse.name);
    localStorage.setItem('userEmail', authResponse.email);
}

// Get user data
function getUserData() {
    return {
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        userEmail: localStorage.getItem('userEmail')
    };
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Check auth on protected pages
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Setup logout button
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

// Show success message
function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    setupLogoutButton();
});
