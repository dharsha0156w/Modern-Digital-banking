// DOM Elements
const loginBox = document.getElementById('login-box');
const signupBox = document.getElementById('signup-box');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const authTabs = document.querySelectorAll('.auth-tab');
const passwordToggles = document.querySelectorAll('.password-toggle');

// Initialize DB Digital Banking theme
function initializeDBBankingTheme() {
    // Set dark theme as default
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Update page title with DB Digital Banking
    document.title = "DB Digital Banking | Secure Online Banking";
    
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
    
    // Focus on first input
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
    
    // Focus on first input
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

// Login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Clear previous errors
    document.getElementById('login-email-group').classList.remove('error');
    document.getElementById('login-password-group').classList.remove('error');
    
    // Validate email
    if (!validateEmail(email)) {
        document.getElementById('login-email-group').classList.add('error');
        isValid = false;
    }
    
    // Validate password
    if (password.length < 8) {
        document.getElementById('login-password-group').classList.add('error');
        isValid = false;
    }
    
    if (isValid) {
        // Show success message
        document.getElementById('login-success').style.display = 'block';
        
        // Log for demo
        console.log('DB Digital Banking Login Attempt:', email);
        
        // Simulate redirect to dashboard after 2 seconds
        setTimeout(() => {
            alert('✅ DB Digital Banking Login Successful!\n\nWelcome to your secure banking dashboard.');
            document.getElementById('login-success').style.display = 'none';
            loginForm.reset();
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
    
    // Clear previous errors
    document.getElementById('signup-name-group').classList.remove('error');
    document.getElementById('signup-email-group').classList.remove('error');
    document.getElementById('signup-phone-group').classList.remove('error');
    document.getElementById('signup-password-group').classList.remove('error');
    document.getElementById('signup-confirm-group').classList.remove('error');
    document.getElementById('terms-error').style.display = 'none';
    
    // Validate name
    if (name.trim().length < 2) {
        document.getElementById('signup-name-group').classList.add('error');
        isValid = false;
    }
    
    // Validate email
    if (!validateEmail(email)) {
        document.getElementById('signup-email-group').classList.add('error');
        isValid = false;
    }
    
    // Validate phone
    if (!validatePhone(phone)) {
        document.getElementById('signup-phone-group').classList.add('error');
        isValid = false;
    }
    
    // Validate password
    if (!validatePassword(password)) {
        document.getElementById('signup-password-group').classList.add('error');
        isValid = false;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
        document.getElementById('signup-confirm-group').classList.add('error');
        isValid = false;
    }
    
    // Validate terms
    if (!terms) {
        document.getElementById('terms-error').style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        // Show success message
        document.getElementById('signup-success').style.display = 'block';
        
        // Log for demo
        console.log('DB Digital Banking Account Creation:', { name, email, phone });
        
        // Reset form and switch to login after 3 seconds
        setTimeout(() => {
            signupForm.reset();
            document.getElementById('signup-success').style.display = 'none';
            showLogin();
            
            // Show welcome message
            alert(`🎉 Welcome to DB Digital Banking, ${name}!\n\nYour account has been created successfully.`);
        }, 3000);
    }
});

// Real-time validation for login form
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

// Real-time validation for signup form
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
    
    // Also validate confirm password if it has value
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

// Forgot password link
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt('🔐 DB Digital Banking Password Reset\n\nPlease enter your email address:');
    if (email && validateEmail(email)) {
        alert(`✅ Password reset link has been sent to:\n${email}`);
    } else if (email) {
        alert('⚠️ Please enter a valid DB Digital Banking email address.');
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDBBankingTheme();
});