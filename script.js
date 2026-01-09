// API Configuration
const API_BASE_URL = "http://localhost:8000";

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
let vantaEffect = null;
let otpTimer = null;

// Initialize Theme with Vanta.js
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
    getUserLocation();
    initVantaBackground();
}

// Vanta.js Background
function initVantaBackground() {
    if (typeof VANTA === 'undefined' || !VANTA.NET) {
        setTimeout(initVantaBackground, 1000);
        return;
    }
    
    if (vantaEffect) {
        vantaEffect.destroy();
    }
    
    vantaEffect = VANTA.NET({
        el: "#vanta-background",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x4dabf7,
        backgroundColor: 0x003045e,
        points: 12.00,
        maxDistance: 22.00,
        spacing: 17.00,
        showDots: true
    });
    
    window.addEventListener('resize', function() {
        if (vantaEffect) {
            vantaEffect.resize();
        }
    });
}

// Get User Location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
            },
            (error) => {
                console.warn("Location access denied");
                userLocation = null;
            }
        );
    }
}

// Form Switching
function showLogin() {
    signupBox.classList.remove('active');
    loginBox.classList.add('active');
    
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
    
    document.querySelectorAll('.auth-tab').forEach(tab => {
        if (tab.dataset.tab === 'signup') {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    document.getElementById('signup-name').focus();
}

// Event Listeners
switchToSignup.addEventListener('click', function(e) {
    e.preventDefault();
    showSignup();
});

switchToLogin.addEventListener('click', function(e) {
    e.preventDefault();
    showLogin();
});

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

// Password Toggle
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

// Validation Functions
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
            headers: {'Content-Type': 'application/json'},
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
            headers: {'Content-Type': 'application/json'},
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

async function forgotPassword(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Failed to send OTP');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

async function verifyOTP(email, otp) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: email, otp: otp })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Invalid OTP');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

async function resetPassword(email, otp, newPassword) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                otp: otp,
                new_password: newPassword
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Failed to reset password');
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

// Login Form
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginButton = this.querySelector('.btn-primary');
    
    document.getElementById('login-email-group').classList.remove('error');
    document.getElementById('login-password-group').classList.remove('error');
    
    let isValid = true;
    
    if (!validateEmail(email)) {
        document.getElementById('login-email-group').classList.add('error');
        isValid = false;
    }
    
    if (password.length < 8) {
        document.getElementById('login-password-group').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) return;
    
    const originalText = loginButton.textContent;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    loginButton.disabled = true;
    
    try {
        const loginData = {
            username: email,
            password: password,
            latitude: userLocation ? userLocation.latitude : null,
            longitude: userLocation ? userLocation.longitude : null
        };
        
        const result = await loginUser(loginData);
        saveAuthData(result.access_token, result.user);
        
        document.getElementById('login-success').style.display = 'block';
        document.getElementById('login-success').innerHTML = `
            <i class="fas fa-check-circle"></i> 
            Login successful! Loading your dashboard...
        `;
        
        const dashboardData = await getDashboardData(result.access_token);
        
        setTimeout(() => {
            showDashboard(dashboardData);
        }, 1500);
        
    } catch (error) {
        alert(`❌ Login Failed: ${error.message}`);
        loginButton.textContent = originalText;
        loginButton.disabled = false;
    }
});

// Signup Form
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const terms = document.getElementById('terms').checked;
    const signupButton = this.querySelector('.btn-primary');
    
    document.getElementById('signup-name-group').classList.remove('error');
    document.getElementById('signup-email-group').classList.remove('error');
    document.getElementById('signup-phone-group').classList.remove('error');
    document.getElementById('signup-password-group').classList.remove('error');
    document.getElementById('signup-confirm-group').classList.remove('error');
    document.getElementById('terms-error').style.display = 'none';
    
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
    
    if (!isValid) return;
    
    const originalText = signupButton.textContent;
    signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    signupButton.disabled = true;
    
    try {
        const userData = {
            name: name,
            email: email,
            phone: phone,
            password: password
        };
        
        const result = await registerUser(userData);
        saveAuthData(result.access_token, result.user);
        
        document.getElementById('signup-success').style.display = 'block';
        document.getElementById('signup-success').innerHTML = `
            <i class="fas fa-check-circle"></i> 
            Account created successfully! Welcome to DB Digital Banking...
        `;
        
        const dashboardData = await getDashboardData(result.access_token);
        
        setTimeout(() => {
            showDashboard(dashboardData);
        }, 1500);
        
    } catch (error) {
        alert(`❌ Registration Failed: ${error.message}`);
        signupButton.textContent = originalText;
        signupButton.disabled = false;
    }
});

// OTP Forgot Password System
function showForgotPasswordModal() {
    const modalHTML = `
        <div class="modal-overlay" id="forgot-password-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Reset Your Password</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="otp-step active" id="step-email">
                        <div class="form-group">
                            <label>Enter your registered email address</label>
                            <div class="input-with-icon">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="reset-email" placeholder="your@email.com">
                            </div>
                            <div class="error-message" id="reset-email-error"></div>
                        </div>
                        <button class="btn btn-primary" onclick="sendOTP()">Send OTP</button>
                    </div>
                    
                    <div class="otp-step" id="step-otp">
                        <div class="form-group">
                            <label>Enter the 6-digit OTP sent to your email</label>
                            <div class="otp-input-container">
                                <input type="text" maxlength="1" class="otp-digit" data-index="0">
                                <input type="text" maxlength="1" class="otp-digit" data-index="1">
                                <input type="text" maxlength="1" class="otp-digit" data-index="2">
                                <input type="text" maxlength="1" class="otp-digit" data-index="3">
                                <input type="text" maxlength="1" class="otp-digit" data-index="4">
                                <input type="text" maxlength="1" class="otp-digit" data-index="5">
                            </div>
                            <div class="otp-timer" id="otp-timer">
                                OTP expires in: <span id="timer">10:00</span>
                            </div>
                            <div class="error-message" id="otp-error"></div>
                        </div>
                        <div class="otp-actions">
                            <button class="btn btn-outline" onclick="resendOTP()">Resend OTP</button>
                            <button class="btn btn-primary" onclick="verifyOTP()">Verify OTP</button>
                        </div>
                    </div>
                    
                    <div class="otp-step" id="step-password">
                        <div class="form-group">
                            <label>Create New Password</label>
                            <div class="input-with-icon">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="new-password" placeholder="New password">
                            </div>
                            <div class="password-strength" id="password-strength">
                                <div class="strength-bar"></div>
                                <div class="strength-text">Password strength: Weak</div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Confirm New Password</label>
                            <div class="input-with-icon">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="confirm-password" placeholder="Confirm password">
                            </div>
                            <div class="error-message" id="password-error"></div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="resetPassword()">Reset Password</button>
                    </div>
                    
                    <div class="otp-step" id="step-success">
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h4>Password Reset Successful!</h4>
                            <p>Your password has been changed successfully.</p>
                            <p>Redirecting to login page...</p>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <p>Remember your password? <a href="#" onclick="closeModal()">Back to Login</a></p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    initializeOTPInput();
}

// OTP Functions
function closeModal() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.remove();
    clearOTPTimer();
}

async function sendOTP() {
    const email = document.getElementById('reset-email').value;
    const errorElement = document.getElementById('reset-email-error');
    
    if (!validateEmail(email)) {
        errorElement.textContent = "Please enter a valid email address";
        errorElement.style.display = 'block';
        return;
    }
    
    errorElement.style.display = 'none';
    
    try {
        const response = await forgotPassword(email);
        
        showStep('step-otp');
        startOTPTimer(10 * 60);
        sessionStorage.setItem('reset_email', email);
        
        alert(`✅ OTP sent to ${email}. Please check your inbox.`);
        
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
}

async function verifyOTP() {
    const email = sessionStorage.getItem('reset_email');
    const otp = getOTPFromInput();
    const errorElement = document.getElementById('otp-error');
    
    if (otp.length !== 6) {
        errorElement.textContent = "Please enter a valid 6-digit OTP";
        errorElement.style.display = 'block';
        return;
    }
    
    errorElement.style.display = 'none';
    
    try {
        await verifyOTP(email, otp);
        sessionStorage.setItem('verified_otp', otp);
        showStep('step-password');
        clearOTPTimer();
        
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
    }
}

async function resetPassword() {
    const email = sessionStorage.getItem('reset_email');
    const otp = sessionStorage.getItem('verified_otp');
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorElement = document.getElementById('password-error');
    
    if (newPassword.length < 8) {
        errorElement.textContent = "Password must be at least 8 characters";
        errorElement.style.display = 'block';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        errorElement.textContent = "Passwords do not match";
        errorElement.style.display = 'block';
        return;
    }
    
    errorElement.style.display = 'none';
    
    try {
        await resetPassword(email, otp, newPassword);
        showStep('step-success');
        
        sessionStorage.removeItem('reset_email');
        sessionStorage.removeItem('verified_otp');
        
        setTimeout(() => {
            closeModal();
            showLogin();
            alert("✅ Password changed successfully! Please login with your new password.");
        }, 3000);
        
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
    }
}

// OTP Helpers
function initializeOTPInput() {
    const otpInputs = document.querySelectorAll('.otp-digit');
    
    otpInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            const index = parseInt(e.target.dataset.index);
            
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            if (value.length === 1 && index < 5) {
                otpInputs[index + 1].focus();
            }
            
            if (value.length === 0 && index > 0 && e.inputType === 'deleteContentBackward') {
                otpInputs[index - 1].focus();
            }
        });
    });
}

function getOTPFromInput() {
    const otpInputs = document.querySelectorAll('.otp-digit');
    return Array.from(otpInputs).map(input => input.value).join('');
}

function showStep(stepId) {
    document.querySelectorAll('.otp-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const step = document.getElementById(stepId);
    if (step) step.classList.add('active');
}

function startOTPTimer(duration) {
    clearOTPTimer();
    
    const timerElement = document.getElementById('timer');
    let timeLeft = duration;
    
    otpTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearOTPTimer();
            document.getElementById('otp-error').textContent = "OTP has expired. Please request a new one.";
            document.getElementById('otp-error').style.display = 'block';
        } else {
            timeLeft--;
        }
    }, 1000);
}

function clearOTPTimer() {
    if (otpTimer) {
        clearInterval(otpTimer);
        otpTimer = null;
    }
}

async function resendOTP() {
    const email = sessionStorage.getItem('reset_email');
    
    if (!email) {
        alert("Please enter your email first");
        showStep('step-email');
        return;
    }
    
    try {
        await sendOTP();
        alert("✅ New OTP sent successfully!");
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
}

// Dashboard
function showDashboard(dashboardData) {
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
    
    const mainElement = document.querySelector('main');
    mainElement.innerHTML = dashboardHTML;
}

// Logout
window.logout = function() {
    clearAuthData();
    location.reload();
}

// Forgot Password Link
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    showForgotPasswordModal();
});

// Real-time Validation
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

// Check Auth Status
function checkAuthStatus() {
    const { token, user } = getAuthData();
    
    if (token && user) {
        getDashboardData(token)
            .then(showDashboard)
            .catch(error => {
                console.warn("Session expired:", error);
                clearAuthData();
                initializeTheme();
            });
    } else {
        initializeTheme();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});