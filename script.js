/*// DOM Elements
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
*/
// DOM Elements
const loginBox = document.getElementById('login-box');
const signupBox = document.getElementById('signup-box');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const authTabs = document.querySelectorAll('.auth-tab');
const passwordToggles = document.querySelectorAll('.password-toggle');

// Initialize theme
function initializeTheme() {
    // Set dark theme as default
    document.documentElement.setAttribute('data-theme', 'dark');
    
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

// Switch between login and signup forms with animation
function showLogin() {
    signupBox.classList.remove('active');
    
    // Small delay for better animation
    setTimeout(() => {
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
    }, 50);
}

function showSignup() {
    loginBox.classList.remove('active');
    
    // Small delay for better animation
    setTimeout(() => {
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
    }, 50);
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

// Enhanced password visibility toggle
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
            this.style.color = 'var(--primary)';
        } else {
            passwordInput.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
            this.style.color = 'var(--gray)';
        }
        
        // Add animation
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
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

function showButtonLoading(button) {
    const originalText = button.textContent;
    button.innerHTML = '<span class="btn-loading"></span>';
    button.disabled = true;
    
    return function() {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// Login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginButton = this.querySelector('.btn-primary');
    const resetButton = showButtonLoading(loginButton);
    
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
        // Simulate API call with delay
        setTimeout(() => {
            // Show success message
            document.getElementById('login-success').style.display = 'block';
            
            // Log for demo
            console.log('Login attempt with:', { email, password: '***' });
            
            // Reset button
            resetButton();
            
            // Simulate redirect to dashboard after 2 seconds
            setTimeout(() => {
                // In real app: window.location.href = 'dashboard.html';
                alert('Login successful! In a real application, you would be redirected to your banking dashboard.');
                document.getElementById('login-success').style.display = 'none';
                loginForm.reset();
            }, 2000);
        }, 1500);
    } else {
        // Reset button if validation failed
        setTimeout(resetButton, 500);
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
    const signupButton = this.querySelector('.btn-primary');
    const resetButton = showButtonLoading(signupButton);
    
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
        // Simulate API call with delay
        setTimeout(() => {
            // Show success message
            document.getElementById('signup-success').style.display = 'block';
            
            // Log for demo
            console.log('Signup attempt with:', { 
                name, 
                email, 
                phone, 
                password: '***' 
            });
            
            // Reset button
            resetButton();
            
            // Reset form and switch to login after 3 seconds
            setTimeout(() => {
                signupForm.reset();
                document.getElementById('signup-success').style.display = 'none';
                showLogin();
                
                // Show welcome message
                alert(`Welcome to Nexus Bank, ${name}! Your account has been created successfully.`);
            }, 3000);
        }, 1500);
    } else {
        // Reset button if validation failed
        setTimeout(resetButton, 500);
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
    const email = prompt('Please enter your email address to reset your password:');
    if (email && validateEmail(email)) {
        alert(`Password reset link has been sent to ${email}. Check your inbox.`);
    } else if (email) {
        alert('Please enter a valid email address.');
    }
});

// Initialize theme when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    // Add subtle animation to logo
    const logo = document.querySelector('.logo');
    setTimeout(() => {
        logo.style.transform = 'translateY(0)';
        logo.style.opacity = '1';
    }, 300);
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+1 for login form
    if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        showLogin();
    }
    
    // Ctrl+2 for signup form
    if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        showSignup();
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        const activeForm = document.querySelector('.auth-box.active form');
        if (activeForm && confirm('Clear form?')) {
            activeForm.reset();
            
            // Clear validation states
            const groups = activeForm.querySelectorAll('.form-group');
            groups.forEach(group => {
                group.classList.remove('error', 'success');
            });
        }
    }
});

// Add hover effects for better UX
document.querySelectorAll('.auth-tab, .btn, .forgot-password, .auth-footer a').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});