// Admin Login functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            identifier: document.getElementById('username').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await API.adminLogin(formData);
            saveAuthData(response);
            window.location.href = 'admin-dashboard.html';
        } catch (error) {
            showError('errorMessage', error.message || 'Login failed');
        }
    });
});
