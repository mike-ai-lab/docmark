// DocMark Documentation JavaScript

(function() {
    'use strict';
    
    // Navigation Section Toggle
    const navToggles = document.querySelectorAll('.nav-section-toggle');
    
    navToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const section = this.parentElement;
            const content = section.querySelector('.nav-section-content');
            const icon = this.querySelector('.toggle-icon');
            
            if (content.classList.contains('active')) {
                content.classList.remove('active');
                icon.textContent = '▶';
            } else {
                content.classList.add('active');
                icon.textContent = '▼';
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Highlight active section in navigation
    const updateActiveNav = () => {
        const sections = document.querySelectorAll('.docs-content section');
        const scrollPosition = window.scrollY + 100;
        
        let currentSection = null;
        
        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition) {
                currentSection = section;
            }
        });
        
        if (currentSection) {
            const id = currentSection.getAttribute('id');
            document.querySelectorAll('.sidebar-nav a, .index-nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    };
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial active state
    updateActiveNav();
    
})();
