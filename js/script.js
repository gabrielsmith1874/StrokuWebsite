// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Ensure all navigation links work properly
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // For anchor links on the same page, use smooth scrolling
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
            // For other links, let the default behavior work
        });
    });
    
    // Smooth scrolling for anchor links with sliding indicator
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const navLinksContainer = document.querySelector('.nav-links');
    
    // Initialize sliding indicator
    function initSlidingIndicator() {
        const navLinks = document.querySelectorAll('.nav-link');
        const indicator = navLinksContainer.querySelector('::before') || navLinksContainer;
        
        navLinks.forEach((link, index) => {
            link.addEventListener('mouseenter', function() {
                updateIndicator(this);
            });
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                
                updateIndicator(this);
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navLinksContainer.classList.contains('active')) {
                        navLinksContainer.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                }
            });
        });
        
        // Hide indicator when mouse leaves nav area
        navLinksContainer.addEventListener('mouseleave', function() {
            // Always hide indicator when mouse leaves, regardless of active state
            hideIndicator();
        });
    }
    
    function updateIndicator(activeLink) {
        const indicator = navLinksContainer;
        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = navLinksContainer.getBoundingClientRect();
        
        const translateX = linkRect.left - containerRect.left;
        const width = linkRect.width;
        
        // Update CSS custom properties for the indicator
        indicator.style.setProperty('--indicator-width', width + 'px');
        indicator.style.setProperty('--indicator-x', translateX + 'px');
        
        // Show the indicator
        const style = document.createElement('style');
        style.textContent = `
            .nav-links::before {
                opacity: 1 !important;
                width: var(--indicator-width, 0);
                transform: translateX(var(--indicator-x, 0)) !important;
            }
        `;
        
        // Remove any existing indicator styles
        const existingStyle = document.querySelector('#nav-indicator-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'nav-indicator-style';
        document.head.appendChild(style);
    }
    
    function hideIndicator() {
        const style = document.querySelector('#nav-indicator-style');
        if (style) {
            style.textContent = `
                .nav-links::before {
                    opacity: 0 !important;
                }
            `;
        }
    }
    
    // Initialize the sliding indicator
    initSlidingIndicator();
    
    anchorLinks.forEach(link => {
        // Click handlers are now in initSlidingIndicator
    });
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .step, .download-card, .support-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Download button functionality
    const downloadButtons = document.querySelectorAll('.btn-download');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            const appType = this.getAttribute('data-app');
            
            // Handle Android APK download
            if (appType === 'android') {
                // Let the browser handle the direct download
                // The download attribute in the HTML will ensure proper file naming
                console.log('Starting Android APK download...');
            }
            // For Roku, let the default link behavior work (redirect to GitHub)
        });
    });
    
    // Typing animation for hero title - disabled to prevent HTML display issues
    // const heroTitle = document.querySelector('.hero-title');
    // Animation disabled for better compatibility
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Dynamic counter animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // Add floating particles effect
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(particlesContainer);
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #7B2CBF, #C77DFF);
                border-radius: 50%;
                opacity: 0.3;
                animation: float ${5 + Math.random() * 10}s infinite linear;
            `;
            
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Add floating animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.3;
            }
            90% {
                opacity: 0.3;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .nav-links.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(15, 15, 35, 0.98);
            flex-direction: column;
            padding: 1rem;
            border-top: 1px solid var(--border-color);
            backdrop-filter: blur(20px);
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        @media (min-width: 769px) {
            .nav-links.active {
                display: flex;
                position: static;
                flex-direction: row;
                background: none;
                padding: 0;
                border: none;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Initialize particles
    createParticles();
    
    // Fix contact support links
    initializeContactSupport();
});

// Contact support functionality
function initializeContactSupport() {
    console.log("Initializing contact support...");
    
    // Handle all mailto links
    const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    mailtoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log("Contact link clicked:", this.href);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Try to open email client
            try {
                // Let the default mailto behavior work
                console.log("Opening email client...");
            } catch (error) {
                console.error("Error opening email client:", error);
                // Fallback: show email address in a modal
                showEmailFallback();
            }
        });
        
        // Add hover effect
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--light-purple)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = 'var(--accent-purple)';
        });
    });
    
    console.log(`Initialized ${mailtoLinks.length} contact links`);
}

// Roku Store information modal
function showRokuStoreInfo() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: var(--surface-dark);
        padding: 2rem;
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--border-color);
        text-align: center;
        max-width: 500px;
        margin: 1rem;
        box-shadow: 0 20px 60px rgba(123, 44, 191, 0.3);
    `;
    
    modalContent.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <i class="fas fa-tv" style="font-size: 3rem; color: var(--accent-purple); margin-bottom: 1rem;"></i>
        </div>
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.8rem;">Stroku Receiver</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">
            Search for "Stroku Receiver" in the Roku Channel Store on your Roku device to install the app.
        </p>
        <div style="background: var(--background-surface); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: left;">
            <h4 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.1rem;">How to install:</h4>
            <ol style="color: var(--text-secondary); margin: 0; padding-left: 1.5rem; line-height: 1.6;">
                <li>Go to the Roku Channel Store on your Roku device</li>
                <li>Search for "Stroku Receiver"</li>
                <li>Select the Stroku Receiver channel</li>
                <li>Click "Add Channel" to install</li>
                <li>Launch the channel from your Roku home screen</li>
            </ol>
        </div>
        <p style="color: var(--text-hint); font-size: 0.9rem; margin-bottom: 1.5rem;">
            The Stroku Receiver is free and available on all Roku devices.
        </p>
        <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                style="background: linear-gradient(135deg, var(--primary-purple), var(--secondary-purple)); 
                       color: white; border: none; padding: 12px 24px; border-radius: 8px; 
                       cursor: pointer; font-weight: 600; transition: transform 0.2s;">
            Got it!
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on Escape key
    const handleEscape = function(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Fallback function to show email address if mailto fails
function showEmailFallback() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: var(--surface-dark);
        padding: 2rem;
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--border-color);
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        box-shadow: 0 20px 60px rgba(123, 44, 191, 0.3);
    `;
    
    modalContent.innerHTML = `
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.5rem;">Contact Support</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">Email us directly at:</p>
        <div style="background: var(--background-surface); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <p style="color: var(--accent-purple); font-size: 1.2rem; font-weight: 600; margin: 0;">gabrielsmith1874@gmail.com</p>
        </div>
        <p style="color: var(--text-hint); font-size: 0.9rem; margin-bottom: 1.5rem;">Copy the email address above and paste it into your email client.</p>
        <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                style="background: linear-gradient(135deg, var(--primary-purple), var(--secondary-purple)); 
                       color: white; border: none; padding: 12px 24px; border-radius: 8px; 
                       cursor: pointer; font-weight: 600; transition: transform 0.2s;">
            Got it!
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            modal.remove();
        }
    });
}

// Show download information modal
function showDownloadInfo(title, message) {
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: var(--surface-dark);
        padding: 2rem;
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--border-color);
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        box-shadow: 0 20px 60px rgba(123, 44, 191, 0.3);
    `;
    
    modalContent.innerHTML = `
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.5rem;">${title}</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">${message}</p>
        <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                style="background: linear-gradient(135deg, var(--primary-purple), var(--secondary-purple)); 
                       color: white; border: none; padding: 12px 24px; border-radius: 8px; 
                       cursor: pointer; font-weight: 600; transition: transform 0.2s;">
            Got it!
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            modal.remove();
        }
    });
}
