// Register page functionality
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showError('errorMessage', 'Passwords do not match');
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: password,
            address: document.getElementById('address').value
        };

        try {
            const response = await API.register(formData);
            saveAuthData(response);
            showSuccess('successMessage', 'Registration successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (error) {
            showError('errorMessage', error.message || 'Registration failed');
        }
    });
});
