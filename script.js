// API Configuration
const API_BASE_URL = "http://localhost:8000"; // Update this to your backend URL

// DOM Elements
const loginBox = document.getElementById('login-box');
const signupBox = document.getElementById('signup-box');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const authTabs = document.querySelectorAll('.auth-tab');
const passwordToggles = document.querySelectorAll('.password-toggle');

// State Management
let userLocation = null;

// Initialize DB Digital Banking theme
function initializeDBBankingTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.title = "DB Digital Banking | Secure Online Banking";
    
    // Get user location if available
    getUserLocation();
    
    // Add animation to form elements
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Get user location for location-aware authentication
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                console.log("Location detected:", userLocation);
            },
            (error) => {
                console.warn("Location access denied or unavailable");
                userLocation = null;
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }
}

// Switch between login and signup forms
function showLogin() {
    signupBox.classList.remove('active');
    loginBox.classList.add('active');
    
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        if (tab.dataset.tab === 'login') {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    document.getElementById('login-email').focus();
}

function showSignup() {
    loginBox.classList.remove('active');
    signupBox.classList.add('active');
    
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        if (tab.dataset.tab === 'signup') {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    document.getElementById('signup-name').focus();
}

// Event listeners for switching forms
switchToSignup.addEventListener('click', function(e) {
    e.preventDefault();
    showSignup();
});

switchToLogin.addEventListener('click', function(e) {
    e.preventDefault();
    showLogin();
});

// Event listeners for tabs
authTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        if (tabName === 'login') {
            showLogin();
        } else {
            showSignup();
        }
    });
});

// Password visibility toggle
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        let passwordInput;
        
        if (this.id === 'login-toggle-password') {
            passwordInput = document.getElementById('login-password');
        } else {
            passwordInput = document.getElementById('signup-password');
        }
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});

// Form validation functions
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
}

// API Functions
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

async function loginUser(loginData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

async function getDashboardData(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch dashboard data');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

// Storage Functions
function saveAuthData(token, userData) {
    localStorage.setItem('db_banking_token', token);
    localStorage.setItem('db_banking_user', JSON.stringify(userData));
}

function clearAuthData() {
    localStorage.removeItem('db_banking_token');
    localStorage.removeItem('db_banking_user');
}

function getAuthData() {
    const token = localStorage.getItem('db_banking_token');
    const user = localStorage.getItem('db_banking_user');
    
    return {
        token,
        user: user ? JSON.parse(user) : null
    };
}

// Login form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginButton = this.querySelector('.btn-primary');
    
    // Clear previous errors
    document.getElementById('login-email-group').classList.remove('error');
    document.getElementById('login-password-group').classList.remove('error');
    
    // Validate form
    let isValid = true;
    
    if (!validateEmail(email)) {
        document.getElementById('login-email-group').classList.add('error');
        isValid = false;
    }
    
    if (password.length < 8) {
        document.getElementById('login-password-group').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    const originalText = loginButton.textContent;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    loginButton.disabled = true;
    
    try {
        // Prepare login data with location
        const loginData = {
            username: email,
            password: password,
            latitude: userLocation ? userLocation.latitude : null,
            longitude: userLocation ? userLocation.longitude : null
        };
        
        // Call login API
        const result = await loginUser(loginData);
        
        // Save auth data
        saveAuthData(result.access_token, result.user);
        
        // Show success
        document.getElementById('login-success').style.display = 'block';
        document.getElementById('login-success').innerHTML = `
            <i class="fas fa-check-circle"></i> 
            Login successful! Loading your dashboard...
        `;
        
        // Get dashboard data
        const dashboardData = await getDashboardData(result.access_token);
        
        // Simulate redirect to dashboard
        setTimeout(() => {
            // In a real app, you would redirect to a dashboard page
            showDashboard(dashboardData);
        }, 1500);
        
    } catch (error) {
        // Show error
        alert(`❌ Login Failed: ${error.message}`);
        
        // Reset button
        loginButton.textContent = originalText;
        loginButton.disabled = false;
    }
});

// Signup form submission
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const terms = document.getElementById('terms').checked;
    const signupButton = this.querySelector('.btn-primary');
    
    // Clear previous errors
    document.getElementById('signup-name-group').classList.remove('error');
    document.getElementById('signup-email-group').classList.remove('error');
    document.getElementById('signup-phone-group').classList.remove('error');
    document.getElementById('signup-password-group').classList.remove('error');
    document.getElementById('signup-confirm-group').classList.remove('error');
    document.getElementById('terms-error').style.display = 'none';
    
    // Validate form
    let isValid = true;
    
    if (name.trim().length < 2) {
        document.getElementById('signup-name-group').classList.add('error');
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        document.getElementById('signup-email-group').classList.add('error');
        isValid = false;
    }
    
    if (!validatePhone(phone)) {
        document.getElementById('signup-phone-group').classList.add('error');
        isValid = false;
    }
    
    if (!validatePassword(password)) {
        document.getElementById('signup-password-group').classList.add('error');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('signup-confirm-group').classList.add('error');
        isValid = false;
    }
    
    if (!terms) {
        document.getElementById('terms-error').style.display = 'block';
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    const originalText = signupButton.textContent;
    signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    signupButton.disabled = true;
    
    try {
        // Prepare registration data
        const userData = {
            name: name,
            email: email,
            phone: phone,
            password: password
        };
        
        // Call register API
        const result = await registerUser(userData);
        
        // Save auth data
        saveAuthData(result.access_token, result.user);
        
        // Show success
        document.getElementById('signup-success').style.display = 'block';
        document.getElementById('signup-success').innerHTML = `
            <i class="fas fa-check-circle"></i> 
            Account created successfully! Welcome to DB Digital Banking...
        `;
        
        // Get dashboard data
        const dashboardData = await getDashboardData(result.access_token);
        
        // Switch to dashboard after delay
        setTimeout(() => {
            showDashboard(dashboardData);
        }, 1500);
        
    } catch (error) {
        // Show error
        alert(`❌ Registration Failed: ${error.message}`);
        
        // Reset button
        signupButton.textContent = originalText;
        signupButton.disabled = false;
    }
});

// Show Dashboard (simulated)
function showDashboard(dashboardData) {
    // Create dashboard HTML
    const dashboardHTML = `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h2>DB Digital Banking Dashboard</h2>
                <button onclick="logout()" class="btn btn-outline">Logout</button>
            </div>
            
            <div class="welcome-banner">
                <h3>Welcome, ${dashboardData.user.name}!</h3>
                <p>Your DB Digital Banking experience starts here</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="dashboard-card balance-card">
                    <h4><i class="fas fa-wallet"></i> Account Balance</h4>
                    <div class="balance-amount">$${dashboardData.balance.toFixed(2)}</div>
                    <p class="account-number">Account: ${dashboardData.account_number}</p>
                </div>
                
                <div class="dashboard-card info-card">
                    <h4><i class="fas fa-user"></i> Account Information</h4>
                    <div class="info-item">
                        <span>Name:</span>
                        <span>${dashboardData.user.name}</span>
                    </div>
                    <div class="info-item">
                        <span>Email:</span>
                        <span>${dashboardData.user.email}</span>
                    </div>
                    <div class="info-item">
                        <span>Phone:</span>
                        <span>${dashboardData.user.phone}</span>
                    </div>
                    <div class="info-item">
                        <span>Member Since:</span>
                        <span>${dashboardData.user.joined}</span>
                    </div>
                </div>
                
                <div class="dashboard-card security-card">
                    <h4><i class="fas fa-shield-alt"></i> Security Status</h4>
                    <div class="security-status ${dashboardData.location_verified ? 'verified' : 'warning'}">
                        <i class="fas ${dashboardData.location_verified ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                        <span>${dashboardData.location_verified ? 'Location Verified' : 'Location Not Available'}</span>
                    </div>
                    <p>Last Login: ${new Date(dashboardData.last_login).toLocaleString()}</p>
                </div>
                
                <div class="dashboard-card transactions-card">
                    <h4><i class="fas fa-exchange-alt"></i> Recent Transactions</h4>
                    <div class="transactions-list">
                        ${dashboardData.recent_transactions.map(transaction => `
                            <div class="transaction-item">
                                <div>
                                    <strong>${transaction.description}</strong>
                                    <small>${transaction.date}</small>
                                </div>
                                <span class="amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                                    ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="dashboard-footer">
                <p>Need help? Contact DB Digital Banking Support at 1-800-DB-BANKING</p>
            </div>
        </div>
    `;
    
    // Replace main content with dashboard
    const mainElement = document.querySelector('main');
    mainElement.innerHTML = dashboardHTML;
}

// Logout function
window.logout = function() {
    clearAuthData();
    location.reload();
}

// Forgot password link
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt('🔐 DB Digital Banking Password Reset\n\nPlease enter your email address:');
    if (email && validateEmail(email)) {
        alert(`✅ Password reset link has been sent to:\n${email}\n\nPlease check your email for further instructions.`);
    } else if (email) {
        alert('⚠️ Please enter a valid DB Digital Banking email address.');
    }
});

// Real-time validation
document.getElementById('login-email').addEventListener('input', function() {
    const group = document.getElementById('login-email-group');
    if (validateEmail(this.value)) {
        group.classList.remove('error');
        group.classList.add('success');
    } else {
        group.classList.remove('success');
        if (this.value.length > 0) {
            group.classList.add('error');
        }
    }
});

document.getElementById('login-password').addEventListener('input', function() {
    const group = document.getElementById('login-password-group');
    if (this.value.length >= 8) {
        group.classList.remove('error');
        group.classList.add('success');
    } else {
        group.classList.remove('success');
        if (this.value.length > 0 && this.value.length < 8) {
            group.classList.add('error');
        }
    }
});

// Signup validation
document.getElementById('signup-name').addEventListener('input', function() {
    const group = document.getElementById('signup-name-group');
    if (this.value.trim().length >= 2) {
        group.classList.remove('error');
        group.classList.add('success');
    } else {
        group.classList.remove('success');
        if (this.value.length > 0) {
            group.classList.add('error');
        }
    }
});

document.getElementById('signup-email').addEventListener('input', function() {
    const group = document.getElementById('signup-email-group');
    if (validateEmail(this.value)) {
        group.classList.remove('error');
        group.classList.add('success');
    } else {
        group.classList.remove('success');
        if (this.value.length > 0) {
            group.classList.add('error');
        }
    }
});

document.getElementById('signup-phone').addEventListener('input', function() {
    const group = document.getElementById('signup-phone-group');
    if (validatePhone(this.value)) {
        group.classList.remove('error');
        group.classList.add('success');
    } else {
        group.classList.remove('success');
        if (this.value.length > 0) {
            group.classList.add('error');
        }
    }
});

document.getElementById('signup-password').addEventListener('input', function() {
    const group = document.getElementById('signup-password-group');
    if (validatePassword(this.value)) {
        group.classList.remove('error');
        group.classList.add('success');
    } else {
        group.classList.remove('success');
        if (this.value.length > 0) {
            group.classList.add('error');
        }
    }
    
    const confirmPassword = document.getElementById('signup-confirm').value;
    const confirmGroup = document.getElementById('signup-confirm-group');
    if (confirmPassword && this.value !== confirmPassword) {
        confirmGroup.classList.add('error');
        confirmGroup.classList.remove('success');
    } else if (confirmPassword) {
        confirmGroup.classList.remove('error');
        confirmGroup.classList.add('success');
    }
});

document.getElementById('signup-confirm').addEventListener('input', function() {
    const password = document.getElementById('signup-password').value;
    const group = document.getElementById('signup-confirm-group');
    
    if (this.value === password && password.length > 0) {
        group.classList.remove('error');
        group.classList.add('success');
    } else {
        group.classList.remove('success');
        if (this.value.length > 0) {
            group.classList.add('error');
        }
    }
});

// Check if user is already logged in
function checkAuthStatus() {
    const { token, user } = getAuthData();
    
    if (token && user) {
        // Try to get dashboard data
        getDashboardData(token)
            .then(dashboardData => {
                showDashboard(dashboardData);
            })
            .catch(error => {
                console.warn("Session expired:", error);
                clearAuthData();
                initializeDBBankingTheme();
            });
    } else {
        initializeDBBankingTheme();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});