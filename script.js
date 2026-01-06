// DOM Elements
const loginBox = document.getElementById('login-box');
const signupBox = document.getElementById('signup-box');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const authTabs = document.querySelectorAll('.auth-tab');
const passwordToggles = document.querySelectorAll('.password-toggle');

// Switch between login and signup forms
function showLogin() {
    loginBox.classList.add('active');
    signupBox.classList.remove('active');
    
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        if (tab.dataset.tab === 'login') {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function showSignup() {
    signupBox.classList.add('active');
    loginBox.classList.remove('active');
    
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        if (tab.dataset.tab === 'signup') {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
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

// Toggle password visibility
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const inputId = this.id === 'login-toggle-password' ? 'login-password' : 'signup-password';
        const passwordInput = document.getElementById(inputId);
        
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
    // Simple phone validation - at least 10 digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
}

// Login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validate email
    if (!validateEmail(email)) {
        document.getElementById('login-email-group').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('login-email-group').classList.remove('error');
    }
    
    // Validate password
    if (password.length < 8) {
        document.getElementById('login-password-group').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('login-password-group').classList.remove('error');
    }
    
    if (isValid) {
        // Show success message
        document.getElementById('login-success').style.display = 'block';
        
        // In a real app, you would send data to the server here
        console.log('Login attempt with:', { email, password });
        
        // Simulate redirect to dashboard after 2 seconds
        setTimeout(() => {
            alert('In a real application, you would be redirected to the banking dashboard.');
            // window.location.href = 'dashboard.html';
        }, 2000);
    }
});

// Signup form submission
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const terms = document.getElementById('terms').checked;
    
    // Validate name
    if (name.trim().length < 2) {
        document.getElementById('signup-name-group').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('signup-name-group').classList.remove('error');
    }
    
    // Validate email
    if (!validateEmail(email)) {
        document.getElementById('signup-email-group').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('signup-email-group').classList.remove('error');
    }
    
    // Validate phone
    if (!validatePhone(phone)) {
        document.getElementById('signup-phone-group').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('signup-phone-group').classList.remove('error');
    }
    
    // Validate password
    if (!validatePassword(password)) {
        document.getElementById('signup-password-group').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('signup-password-group').classList.remove('error');
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
        document.getElementById('signup-confirm-group').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('signup-confirm-group').classList.remove('error');
    }
    
    // Validate terms
    if (!terms) {
        document.getElementById('terms-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('terms-error').style.display = 'none';
    }
    
    if (isValid) {
        // Show success message
        document.getElementById('signup-success').style.display = 'block';
        
        // In a real app, you would send data to the server here
        console.log('Signup attempt with:', { name, email, phone, password });
        
        // Reset form
        signupForm.reset();
        
        // Switch to login form after 3 seconds
        setTimeout(() => {
            showLogin();
            document.getElementById('signup-success').style.display = 'none';
        }, 3000);
    }
});

// Real-time validation for login form
document.getElementById('login-email').addEventListener('input', function() {
    if (validateEmail(this.value)) {
        document.getElementById('login-email-group').classList.remove('error');
        document.getElementById('login-email-group').classList.add('success');
    } else {
        document.getElementById('login-email-group').classList.remove('success');
    }
});

document.getElementById('login-password').addEventListener('input', function() {
    if (this.value.length >= 8) {
        document.getElementById('login-password-group').classList.remove('error');
        document.getElementById('login-password-group').classList.add('success');
    } else {
        document.getElementById('login-password-group').classList.remove('success');
    }
});

// Real-time validation for signup form
document.getElementById('signup-name').addEventListener('input', function() {
    if (this.value.trim().length >= 2) {
        document.getElementById('signup-name-group').classList.remove('error');
        document.getElementById('signup-name-group').classList.add('success');
    } else {
        document.getElementById('signup-name-group').classList.remove('success');
    }
});

document.getElementById('signup-email').addEventListener('input', function() {
    if (validateEmail(this.value)) {
        document.getElementById('signup-email-group').classList.remove('error');
        document.getElementById('signup-email-group').classList.add('success');
    } else {
        document.getElementById('signup-email-group').classList.remove('success');
    }
});

document.getElementById('signup-phone').addEventListener('input', function() {
    if (validatePhone(this.value)) {
        document.getElementById('signup-phone-group').classList.remove('error');
        document.getElementById('signup-phone-group').classList.add('success');
    } else {
        document.getElementById('signup-phone-group').classList.remove('success');
    }
});

document.getElementById('signup-password').addEventListener('input', function() {
    if (validatePassword(this.value)) {
        document.getElementById('signup-password-group').classList.remove('error');
        document.getElementById('signup-password-group').classList.add('success');
    } else {
        document.getElementById('signup-password-group').classList.remove('success');
    }
    
    // Also validate confirm password if it has value
    const confirmPassword = document.getElementById('signup-confirm').value;
    if (confirmPassword && this.value !== confirmPassword) {
        document.getElementById('signup-confirm-group').classList.add('error');
    } else if (confirmPassword) {
        document.getElementById('signup-confirm-group').classList.remove('error');
    }
});

document.getElementById('signup-confirm').addEventListener('input', function() {
    const password = document.getElementById('signup-password').value;
    if (this.value === password && password.length > 0) {
        document.getElementById('signup-confirm-group').classList.remove('error');
        document.getElementById('signup-confirm-group').classList.add('success');
    } else {
        document.getElementById('signup-confirm-group').classList.remove('success');
        if (this.value.length > 0) {
            document.getElementById('signup-confirm-group').classList.add('error');
        }
    }
});

// Forgot password link
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Password reset functionality would be implemented here. In a real app, this would send a reset link to your email.');
});