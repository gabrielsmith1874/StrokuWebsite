// FAQ Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Search functionality for FAQ
    function addSearchToFAQ() {
        const faqContent = document.querySelector('.faq-content .container');
        const sectionHeader = faqContent.querySelector('.section-header');
        
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'faq-search';
        searchContainer.style.cssText = `
            max-width: 500px;
            margin: 2rem auto;
            position: relative;
        `;
        
        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search FAQ...';
        searchInput.className = 'faq-search-input';
        searchInput.style.cssText = `
            width: 100%;
            padding: 12px 45px 12px 16px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--surface-dark);
            color: var(--text-primary);
            font-size: 1rem;
            transition: var(--transition);
        `;
        
        // Create search icon
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search';
        searchIcon.style.cssText = `
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            pointer-events: none;
        `;
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchIcon);
        
        // Insert after section header
        sectionHeader.parentNode.insertBefore(searchContainer, sectionHeader.nextSibling);
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = searchTerm === '' ? 'block' : 'none';
                }
            });
            
            // Show/hide categories based on visible items
            const categories = document.querySelectorAll('.faq-category');
            categories.forEach(category => {
                const visibleItems = category.querySelectorAll('.faq-item[style*="block"], .faq-item:not([style])');
                const hiddenItems = category.querySelectorAll('.faq-item[style*="none"]');
                
                if (searchTerm === '' || visibleItems.length > hiddenItems.length) {
                    category.style.display = 'block';
                } else {
                    category.style.display = 'none';
                }
            });
        });
    }
    
    // Add search functionality
    addSearchToFAQ();
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close all open FAQ items
            faqItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });
    
    // Auto-open FAQ item from URL hash
    if (window.location.hash) {
        const targetItem = document.querySelector(window.location.hash);
        if (targetItem && targetItem.classList.contains('faq-item')) {
            targetItem.classList.add('active');
            setTimeout(() => {
                targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
});
