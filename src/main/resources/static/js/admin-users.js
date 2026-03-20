// Admin User Management
let currentUserId = null;
let allUsers = [];

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUsers();
    
    document.getElementById('searchInput').addEventListener('input', filterUsers);
    document.getElementById('adminLogoutBtn').addEventListener('click', logout);
    
    // Modal close functionality
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('userModal');
        if (e.target === modal) {
            closeModal();
        }
    });
});

async function loadUsers() {
    const container = document.getElementById('usersContainer');
    
    try {
        container.innerHTML = '<p class="loading">Loading users...</p>';
        allUsers = await API.getAllUsers();
        
        displayUsers(allUsers);
    } catch (error) {
        container.innerHTML = `<p class="error-message">Error loading users: ${error.message}</p>`;
    }
}

function displayUsers(users) {
    const container = document.getElementById('usersContainer');
    
    if (users.length === 0) {
        container.innerHTML = '<p class="no-data">No users found.</p>';
        return;
    }
    
    // Separate active and blocked users
    const activeUsers = users.filter(u => !u.isBlocked);
    const blockedUsers = users.filter(u => u.isBlocked);
    
    let html = '';
    
    // Active Users Section
    if (activeUsers.length > 0) {
        html += '<h3 style="margin-top: 0;">Active Users</h3>';
        html += generateUserTable(activeUsers);
    }
    
    // Blocked Users Section
    if (blockedUsers.length > 0) {
        html += '<h3 style="margin-top: 2rem; color: #dc3545;"><i class="icon-block"></i> Blocked Users</h3>';
        html += generateUserTable(blockedUsers);
    }
    
    container.innerHTML = html;
}

function generateUserTable(users) {
    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Verified</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td><span class="badge badge-${user.isVerified ? 'success' : 'warning'}">${user.isVerified ? 'Verified' : 'Pending'}</span></td>
                        <td><span class="badge badge-${user.isBlocked ? 'danger' : 'success'}">${user.isBlocked ? 'Blocked' : 'Active'}</span></td>
                        <td>${formatDateTime(user.createdAt)}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="viewUser(${user.id})">View</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.phone.toLowerCase().includes(searchTerm)
    );
    
    displayUsers(filteredUsers);
}

async function viewUser(userId) {
    try {
        const user = allUsers.find(u => u.id === userId);
        
        if (!user) {
            showError('User not found');
            return;
        }
        
        currentUserId = userId;
        
        const detailsHtml = `
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>User ID:</strong> ${user.id}
                </div>
                <div class="detail-item">
                    <strong>Name:</strong> ${user.name}
                </div>
                <div class="detail-item">
                    <strong>Email:</strong> ${user.email}
                </div>
                <div class="detail-item">
                    <strong>Phone:</strong> ${user.phone}
                </div>
                <div class="detail-item">
                    <strong>Address:</strong> ${user.address || 'Not provided'}
                </div>
                <div class="detail-item">
                    <strong>Verified:</strong> <span class="badge badge-${user.isVerified ? 'success' : 'warning'}">${user.isVerified ? 'Yes' : 'No'}</span>
                </div>
                <div class="detail-item">
                    <strong>Status:</strong> <span class="badge badge-${user.isBlocked ? 'danger' : 'success'}">${user.isBlocked ? 'Blocked' : 'Active'}</span>
                </div>
                <div class="detail-item">
                    <strong>Registered:</strong> ${formatDateTime(user.createdAt)}
                </div>
                <div class="detail-item">
                    <strong>Last Updated:</strong> ${formatDateTime(user.updatedAt)}
                </div>
            </div>
        `;
        
        document.getElementById('userDetails').innerHTML = detailsHtml;
        
        // Set action buttons based on user status - Remove delete option
        const actionsHtml = `
            ${!user.isBlocked ? 
                `<button class="btn btn-warning" onclick="blockUser(${user.id})"><i class="icon-block"></i> Block User</button>` : 
                `<button class="btn btn-success" onclick="unblockUser(${user.id})"><i class="icon-check"></i> Unblock User</button>`
            }
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        `;
        
        document.getElementById('userActions').innerHTML = actionsHtml;
        document.getElementById('userModal').style.display = 'block';
    } catch (error) {
        showError('Error loading user details: ' + error.message);
    }
}

async function blockUser(userId) {
    if (!confirm('Are you sure you want to block this user?')) return;
    
    try {
        await API.blockUser(userId);
        closeModal();
        loadUsers();
        showSuccess('User blocked successfully');
    } catch (error) {
        showError('Error blocking user: ' + error.message);
    }
}

async function unblockUser(userId) {
    if (!confirm('Are you sure you want to unblock this user?')) return;
    
    try {
        await API.unblockUser(userId);
        closeModal();
        loadUsers();
        showSuccess('User unblocked successfully');
    } catch (error) {
        showError('Error unblocking user: ' + error.message);
    }
}

async function confirmDeleteUser(userId) {
    if (!confirm('Are you sure you want to DELETE this user? This action cannot be undone!')) return;
    
    try {
        await API.deleteUser(userId);
        closeModal();
        loadUsers();
        showSuccess('User deleted successfully');
    } catch (error) {
        showError('Error deleting user: ' + error.message);
    }
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    currentUserId = null;
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
}

function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
}
