// Profile page functionality
checkAuth();

document.addEventListener('DOMContentLoaded', async () => {
    await loadProfile();
    setupProfileForm();
});

async function loadProfile() {
    try {
        const profile = await API.getProfile();
        document.getElementById('name').value = profile.name;
        document.getElementById('email').value = profile.email;
        document.getElementById('phone').value = profile.phone;
        document.getElementById('address').value = profile.address || '';
    } catch (error) {
        showError('profileError', 'Failed to load profile');
    }
}

function setupProfileForm() {
    const form = document.getElementById('profileForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const profileData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        try {
            await API.updateProfile(profileData);
            
            // Update stored user name
            localStorage.setItem('userName', profileData.name);
            
            showSuccess('profileSuccess', 'Profile updated successfully!');
        } catch (error) {
            showError('profileError', error.message || 'Failed to update profile');
        }
    });
}
