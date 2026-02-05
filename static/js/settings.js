// Settings Page - Interactive Features

document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
});

function initializeSettings() {
    // Initialize navigation
    setupNavigation();
    setupSettingsMobileMenu();
    
    // Initialize forms
    setupProfileForm();
    setupPasswordForm();
    setupToggleSwitches();
    // setupPasswordToggle() - disabled, using inline onclick instead
    setupUserManagement();
    setupPasswordToggleEventListeners();
    
    // Initialize icons
    lucide.createIcons();
}

// ============================================
// Navigation
// ============================================

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const section = item.dataset.section;
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show/hide sections
            showSettingsSection(section);
        });
    });
}

function showSettingsSection(sectionName) {
    const sections = document.querySelectorAll('.settings-section');
    
    sections.forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });
    
    const activeSection = document.getElementById(`${sectionName}-section`);
    if (activeSection) {
        activeSection.classList.remove('hidden');
        activeSection.classList.add('active');
        
        // Scroll to top on mobile
        if (window.innerWidth <= 768) {
            activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// ============================================
// Forms
// ============================================

function setupProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
        };
        
        try {
            const response = await fetch('/update-profile/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showToast('Profile updated successfully!');
            } else {
                showToast(data.message || 'Error updating profile', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error updating profile', 'error');
        }
    });
}

function setupPasswordForm() {
    const form = document.getElementById('passwordForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }
        
        const formData = {
            current_password: document.getElementById('currentPassword').value,
            new_password: newPassword,
        };
        
        try {
            const response = await fetch('/change-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                form.reset();
                showToast('Password changed successfully!');
            } else {
                showToast(data.message || 'Error changing password', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error changing password', 'error');
        }
    });
}

// ============================================
// Toggle Switches
// ============================================

function setupToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const label = e.target.id;
            const checked = e.target.checked;
            
            // Save preference to localStorage
            localStorage.setItem(`notification_${label}`, checked);
        });
    });
    
    // Load saved preferences
    toggles.forEach(toggle => {
        const saved = localStorage.getItem(`notification_${toggle.id}`);
        if (saved !== null) {
            toggle.checked = saved === 'true';
        }
    });
}

// ============================================
// Password Toggle
// ============================================

// setupPasswordToggle() - DISABLED - Using inline onclick with togglePasswordVisibility() instead
// function setupPasswordToggle() {
//     const toggleButtons = document.querySelectorAll('.toggle-password');
//     
//     toggleButtons.forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             e.preventDefault();
//             
//             const targetId = btn.dataset.target;
//             const input = document.getElementById(targetId);
//             
//             if (input.type === 'password') {
//                 input.type = 'text';
//                 btn.innerHTML = '<i data-lucide="eye-off"></i>';
//             } else {
//                 input.type = 'password';
//                 btn.innerHTML = '<i data-lucide="eye"></i>';
//             }
//             
//             lucide.createIcons();
//         });
//     });
// }

// ============================================
// User Management (Admin Only)
// ============================================

function setupUserManagement() {
    const addUserBtn = document.getElementById('addUserBtn');
    if (!addUserBtn) return;
    
    addUserBtn.addEventListener('click', () => {
        openModal('addUserModal');
    });
    
    const form = document.getElementById('addUserForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('newUserEmail').value,
                full_name: document.getElementById('newUserName').value,
                role: document.getElementById('newUserRole').value,
            };
            
            try {
                const response = await fetch('/add-user/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify(formData),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    closeModal('addUserModal');
                    form.reset();
                    showToast('User added successfully!');
                    loadUsers(); // Reload users table
                } else {
                    showToast(data.message || 'Error adding user', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error adding user', 'error');
            }
        });
    }
}

function loadUsers() {
    // Load users from server and populate table
    const usersTableBody = document.getElementById('usersTable');
    if (!usersTableBody) return;
    
    try {
        // Get users from the page context (rendered by Django)
        const usersData = window.allUsers || [];
        
        usersTableBody.innerHTML = usersData.map(user => `
            <tr>
                <td>${user.first_name} ${user.last_name || ''}</td>
                <td>${user.email}</td>
                <td>${user.is_staff ? 'Admin' : 'User'}</td>
                <td>${new Date(user.date_joined).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="editUser('${user.id}')">
                        <i data-lucide="edit-2"></i> Edit
                    </button>
                </td>
            </tr>
        `).join('');
        
        lucide.createIcons();
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function editUser(userId) {
    console.log('Edit user:', userId);
    showToast('Edit user functionality coming soon');
}

// ============================================
// Modal Functions
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking overlay
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    }
});

// ============================================
// Toast Notifications
// ============================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    
    // Change icon based on type
    const icon = toast.querySelector('.toast-icon');
    if (type === 'error') {
        icon.setAttribute('data-lucide', 'alert-circle');
        toast.style.background = '#ef4444';
    } else {
        icon.setAttribute('data-lucide', 'check-circle');
        toast.style.background = '#10b981';
    }
    
    toast.classList.remove('hidden');
    lucide.createIcons();
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ============================================
// Utility Functions
// ============================================

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ============================================
// Modal Functions
// ============================================

function openAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// Password Visibility Toggle
// ============================================

function setupPasswordToggleEventListeners() {
    const toggles = document.querySelectorAll('.toggle-password');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const wrapper = this.closest('.password-wrapper');
            if (!wrapper) return;
            
            const input = wrapper.querySelector("input[type='password'], input[type='text']");
            if (!input) return;
            
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '👁️'; // mostra olho aberto
            } else {
                input.type = 'password';
                this.textContent = '🙈'; // mostra olho fechado
            }
        });
    });
}

function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const wrapper = field.closest('.password-wrapper');
    if (!wrapper) return;
    
    const toggle = wrapper.querySelector('.toggle-password');
    if (!toggle) return;
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.textContent = '👁️'; // mostra olho aberto
    } else {
        field.type = 'password';
        toggle.textContent = '🙈'; // mostra olho fechado
    }
}

// Make function available globally
window.togglePasswordVisibility = togglePasswordVisibility;

// ============================================
// Settings Mobile Menu
// ============================================

function setupSettingsMobileMenu() {
    const sidebar = document.querySelector('.settings-sidebar');
    if (!sidebar) return;
    
    const navItems = document.querySelectorAll('.settings-sidebar .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Close sidebar on mobile after selecting item
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });
}

