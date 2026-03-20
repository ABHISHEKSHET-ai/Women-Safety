// Login page functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            identifier: document.getElementById('identifier').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await API.login(formData);
            saveAuthData(response);
            showSuccess('successMessage', 'Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showError('errorMessage', error.message || 'Login failed');
        }
    });
});
// Login page functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            identifier: document.getElementById('identifier').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await API.login(formData);
            saveAuthData(response);
            showSuccess('successMessage', 'Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showError('errorMessage', error.message || 'Login failed');
        }
    });
});
