// Documentation Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation highlighting
    const docsSections = document.querySelectorAll('.docs-section');
    const docsNavLinks = document.querySelectorAll('.docs-nav-link');
    
    // Smooth scrolling for documentation links
    docsNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                docsNavLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Intersection Observer for active section highlighting
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
                
                if (correspondingLink) {
                    docsNavLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    docsSections.forEach(section => {
        if (section.id) {
            sectionObserver.observe(section);
        }
    });
    
    // Copy code functionality
    function addCopyButtons() {
        const codeSnippets = document.querySelectorAll('.code-snippet pre');
        
        codeSnippets.forEach(pre => {
            const codeContainer = pre.parentElement;
            
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyButton.className = 'copy-code-btn';
            copyButton.style.cssText = `
                position: absolute;
                top: 12px;
                right: 12px;
                background: var(--surface-light);
                border: 1px solid var(--border-color);
                color: var(--text-secondary);
                padding: 8px 12px;
                border-radius: var(--border-radius);
                cursor: pointer;
                font-size: 0.875rem;
                transition: var(--transition);
                z-index: 1;
            `;
            
            // Position container relatively
            codeContainer.style.position = 'relative';
            
            // Add copy functionality
            copyButton.addEventListener('click', function() {
                const code = pre.textContent;
                
                navigator.clipboard.writeText(code).then(() => {
                    copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    copyButton.style.color = 'var(--success)';
                    
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                        copyButton.style.color = 'var(--text-secondary)';
                    }, 2000);
                }).catch(() => {
                    copyButton.innerHTML = '<i class="fas fa-times"></i> Failed';
                    copyButton.style.color = 'var(--error)';
                    
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                        copyButton.style.color = 'var(--text-secondary)';
                    }, 2000);
                });
            });
            
            copyButton.addEventListener('mouseenter', function() {
                this.style.background = 'var(--accent-purple)';
                this.style.color = 'var(--text-primary)';
            });
            
            copyButton.addEventListener('mouseleave', function() {
                if (!this.innerHTML.includes('Copied') && !this.innerHTML.includes('Failed')) {
                    this.style.background = 'var(--surface-light)';
                    this.style.color = 'var(--text-secondary)';
                }
            });
            
            codeContainer.appendChild(copyButton);
        });
    }
    
    // Add copy buttons to code snippets
    addCopyButtons();
    
    // Table of Contents generation
    function generateTableOfContents() {
        const tocContainer = document.createElement('div');
        tocContainer.className = 'table-of-contents';
        tocContainer.style.cssText = `
            background: var(--surface-light);
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            padding: 1.5rem;
            margin: 2rem 0;
            position: sticky;
            top: 140px;
        `;
        
        const tocTitle = document.createElement('h3');
        tocTitle.textContent = 'Table of Contents';
        tocTitle.style.cssText = `
            margin: 0 0 1rem;
            color: var(--accent-purple);
            font-size: 1.125rem;
        `;
        
        const tocList = document.createElement('ul');
        tocList.style.cssText = `
            list-style: none;
            margin: 0;
            padding: 0;
        `;
        
        // Generate TOC from h2 elements
        const headings = document.querySelectorAll('.docs-main h2');
        headings.forEach(heading => {
            if (heading.id) {
                const listItem = document.createElement('li');
                listItem.style.marginBottom = '0.5rem';
                
                const link = document.createElement('a');
                link.href = `#${heading.id}`;
                link.textContent = heading.textContent;
                link.style.cssText = `
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: var(--transition);
                    display: block;
                    padding: 0.25rem 0;
                `;
                
                link.addEventListener('mouseenter', function() {
                    this.style.color = 'var(--accent-purple)';
                });
                
                link.addEventListener('mouseleave', function() {
                    this.style.color = 'var(--text-secondary)';
                });
                
                listItem.appendChild(link);
                tocList.appendChild(listItem);
            }
        });
        
        tocContainer.appendChild(tocTitle);
        tocContainer.appendChild(tocList);
        
        // Insert TOC after docs header
        const docsHeader = document.querySelector('.docs-header');
        if (docsHeader && tocList.children.length > 0) {
            docsHeader.parentNode.insertBefore(tocContainer, docsHeader.nextSibling);
        }
    }
    
    // Generate table of contents for large screens
    if (window.innerWidth > 768) {
        generateTableOfContents();
    }
    
    // Collapsible sidebar on mobile
    function setupMobileSidebar() {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.docs-sidebar');
            const toggleButton = document.createElement('button');
            
            toggleButton.innerHTML = '<i class="fas fa-bars"></i> Table of Contents';
            toggleButton.className = 'mobile-toc-toggle';
            toggleButton.style.cssText = `
                display: block;
                width: 100%;
                background: var(--surface-dark);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                padding: 12px 16px;
                border-radius: var(--border-radius);
                margin-bottom: 1rem;
                cursor: pointer;
                font-weight: 600;
                transition: var(--transition);
            `;
            
            toggleButton.addEventListener('click', function() {
                const nav = sidebar.querySelector('.docs-nav');
                if (nav.style.display === 'none') {
                    nav.style.display = 'block';
                    this.innerHTML = '<i class="fas fa-times"></i> Close';
                } else {
                    nav.style.display = 'none';
                    this.innerHTML = '<i class="fas fa-bars"></i> Table of Contents';
                }
            });
            
            // Initially hide nav on mobile
            const nav = sidebar.querySelector('.docs-nav');
            nav.style.display = 'none';
            
            sidebar.insertBefore(toggleButton, nav);
        }
    }
    
    setupMobileSidebar();
    
    // Breadcrumb navigation
    function addBreadcrumbs() {
        const docsMain = document.querySelector('.docs-main');
        const currentPage = document.title.split(' - ')[0];
        
        const breadcrumbContainer = document.createElement('nav');
        breadcrumbContainer.className = 'breadcrumbs';
        breadcrumbContainer.style.cssText = `
            margin-bottom: 2rem;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
        `;
        
        const breadcrumbList = document.createElement('ol');
        breadcrumbList.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            list-style: none;
            margin: 0;
            padding: 0;
            font-size: 0.875rem;
        `;
        
        // Home link
        const homeItem = document.createElement('li');
        const homeLink = document.createElement('a');
        homeLink.href = 'index.html';
        homeLink.textContent = 'Home';
        homeLink.style.cssText = `
            color: var(--accent-purple);
            text-decoration: none;
        `;
        homeItem.appendChild(homeLink);
        
        // Separator
        const separator = document.createElement('li');
        separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
        separator.style.color = 'var(--text-muted)';
        
        // Current page
        const currentItem = document.createElement('li');
        currentItem.textContent = currentPage;
        currentItem.style.color = 'var(--text-secondary)';
        
        breadcrumbList.appendChild(homeItem);
        breadcrumbList.appendChild(separator);
        breadcrumbList.appendChild(currentItem);
        breadcrumbContainer.appendChild(breadcrumbList);
        
        const docsHeader = document.querySelector('.docs-header');
        docsHeader.parentNode.insertBefore(breadcrumbContainer, docsHeader);
    }
    
    addBreadcrumbs();
});
