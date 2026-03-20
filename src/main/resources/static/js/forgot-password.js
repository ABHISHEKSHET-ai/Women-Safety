// Forgot Password functionality
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgotPasswordForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;

        try {
            await API.forgotPassword(email);
            showSuccess('successMessage', 'Password reset link sent to your email!');
            document.getElementById('forgotPasswordForm').reset();
        } catch (error) {
            showError('errorMessage', error.message || 'Failed to send reset link');
        }
    });
});
