// Emergency Contacts functionality
checkAuth();

let editingContactId = null;
let contactsData = []; // Store contacts globally

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    setupModal();
});

async function loadContacts() {
    try {
        const listDiv = document.getElementById('contactsList');
        listDiv.innerHTML = '<p class="loading">Loading contacts...</p>';
        
        contactsData = await API.getEmergencyContacts();

        if (contactsData.length === 0) {
            listDiv.innerHTML = '<p>No emergency contacts added yet. Click "Add Contact" to add one.</p>';
            return;
        }

        listDiv.innerHTML = contactsData.map(contact => `
            <div class="contact-item">
                <div>
                    <h3>${escapeHtml(contact.name)}</h3>
                    <p>📞 ${escapeHtml(contact.phone)}</p>
                    <p>${escapeHtml(contact.relation || 'Contact')}</p>
                </div>
                <div>
                    <button class="btn btn-sm btn-secondary" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn btn-sm" style="background: #dc3545; color: white;" onclick="deleteContact(${contact.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load contacts:', error);
        document.getElementById('contactsList').innerHTML = '<p class="error-message">Failed to load contacts. Please try again.</p>';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

function setupModal() {
    const modal = document.getElementById('contactModal');
    const addBtn = document.getElementById('addContactBtn');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.querySelector('.cancel-btn');
    const form = document.getElementById('contactForm');

    addBtn.addEventListener('click', () => {
        editingContactId = null;
        document.getElementById('modalTitle').textContent = 'Add Emergency Contact';
        document.getElementById('contactForm').reset();
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveContact();
    });
}

async function saveContact() {
    const contactData = {
        name: document.getElementById('contactName').value.trim(),
        phone: document.getElementById('contactPhone').value.trim(),
        relation: document.getElementById('contactRelation').value.trim()
    };

    // Validate inputs
    if (!contactData.name) {
        showError('contactError', 'Name is required');
        return;
    }
    
    if (!contactData.phone) {
        showError('contactError', 'Phone number is required');
        return;
    }

    try {
        let result;
        if (editingContactId) {
            result = await API.updateEmergencyContact(editingContactId, contactData);
        } else {
            result = await API.addEmergencyContact(contactData);
        }

        document.getElementById('contactModal').style.display = 'none';
        document.getElementById('contactForm').reset();
        await loadContacts();
        
        // Show success message
        alert(editingContactId ? 'Contact updated successfully!' : 'Contact added successfully!');
    } catch (error) {
        console.error('Error saving contact:', error);
        showError('contactError', error.message || 'Failed to save contact');
    }
}

function editContact(id) {
    const contact = contactsData.find(c => c.id === id);
    if (!contact) return;
    
    editingContactId = id;
    document.getElementById('modalTitle').textContent = 'Edit Emergency Contact';
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactPhone').value = contact.phone;
    document.getElementById('contactRelation').value = contact.relation || '';
    document.getElementById('contactModal').style.display = 'flex';
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }

    try {
        await API.deleteEmergencyContact(id);
        loadContacts();
    } catch (error) {
        alert('Failed to delete contact: ' + error.message);
    }
}
