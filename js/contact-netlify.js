// Contact form functionality for Netlify Forms
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Form validation
    function validateForm(formData) {
        const errors = [];
        
        if (!formData.name.trim()) {
            errors.push('Name is required');
        }
        
        if (!formData.email.trim()) {
            errors.push('Email is required');
        } else if (!isValidEmail(formData.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!formData.subject) {
            errors.push('Please select a subject');
        }
        
        if (!formData.message.trim()) {
            errors.push('Message is required');
        } else if (formData.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        return errors;
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show success message
    function showSuccess() {
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        contactForm.reset();
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
    
    // Show error message
    function showError(message) {
        errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Scroll to error message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    // Set loading state
    function setLoading(loading) {
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    }
    
    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        const errors = validateForm(formData);
        if (errors.length > 0) {
            showError(errors.join('<br>'));
            return;
        }
        
        // Set loading state
        setLoading(true);
        
        try {
            // Create FormData for Netlify Forms
            const netlifyFormData = new FormData();
            netlifyFormData.append('form-name', 'contact');
            netlifyFormData.append('name', formData.name);
            netlifyFormData.append('email', formData.email);
            netlifyFormData.append('subject', formData.subject);
            netlifyFormData.append('message', formData.message);
            
            console.log('Submitting form data:', {
                'form-name': 'contact',
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message.substring(0, 50) + '...'
            });
            
            // Submit to Netlify Forms using the correct endpoint
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(netlifyFormData).toString()
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (response.ok) {
                showSuccess();
                console.log('Form submitted successfully to Netlify Forms');
            } else {
                const responseText = await response.text();
                console.error('Form submission failed:', response.status, response.statusText, responseText);
                throw new Error(`Failed to submit form: ${response.status} - ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show specific error message based on the error
            let errorMsg = 'Unable to send email. ';
            
            if (error.message.includes('Failed to submit form')) {
                errorMsg += 'The form submission failed. This might be a temporary issue with Netlify Forms. ';
            } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorMsg += 'Network error occurred. Please check your internet connection. ';
            } else {
                errorMsg += 'An unexpected error occurred. ';
            }
            
            errorMsg += 'Please try again or contact us directly at gabrielsmith1874@gmail.com';
            
            showError(errorMsg);
            
            // Fallback: try to open email client with pre-filled content
            try {
                const mailtoLink = `mailto:gabrielsmith1874@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
                    `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
                )}`;
                
                // Show a message that email client will open
                setTimeout(() => {
                    if (confirm('Would you like to open your email client to send the message manually?')) {
                        window.location.href = mailtoLink;
                    }
                }, 2000);
                
            } catch (mailtoError) {
                console.error('Mailto Error:', mailtoError);
            }
        } finally {
            setLoading(false);
        }
    });
    
    // Add input validation feedback
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error styling on input
            this.style.borderColor = '';
        });
    });
    
    // Validate individual field
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (field.name) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Name is required';
                }
                break;
                
            case 'email':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'subject':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please select a subject';
                }
                break;
                
            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }
        
        // Apply visual feedback
        if (!isValid) {
            field.style.borderColor = '#F44336';
            field.style.boxShadow = '0 0 0 3px rgba(244, 67, 54, 0.1)';
        } else {
            field.style.borderColor = '#4CAF50';
            field.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
        }
        
        return isValid;
    }
    
    // Copy email to clipboard functionality
    const emailElements = document.querySelectorAll('.contact-item-content p');
    emailElements.forEach(element => {
        if (element.textContent.includes('@')) {
            element.style.cursor = 'pointer';
            element.title = 'Click to copy email address';
            
            element.addEventListener('click', function() {
                const email = this.textContent.trim();
                navigator.clipboard.writeText(email).then(() => {
                    // Show temporary feedback
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.style.color = '#4CAF50';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.color = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy email:', err);
                });
            });
        }
    });
    
    console.log('Contact form initialized successfully');
    
    // Debug: Log form element and Netlify attributes
    console.log('Form element:', contactForm);
    console.log('Form name attribute:', contactForm.getAttribute('name'));
    console.log('Netlify attribute:', contactForm.hasAttribute('netlify'));
    console.log('Honeypot attribute:', contactForm.getAttribute('netlify-honeypot'));
});
