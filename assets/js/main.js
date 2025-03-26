/**
 * Ayobami Olajide Portfolio
 * Main JavaScript file
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    initializeCookieConsent();
    initializeBackToTop();
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const header = document.querySelector('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Navigation Toggle for Mobile
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                
                // Reset hamburger icon
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.nav-toggle')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            
            // Reset hamburger icon
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            
            // Reset hamburger icon
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

/**
 * Scroll effects for header and elements
 */
function initializeScrollEffects() {
    const header = document.querySelector('header');
    
    // Scroll Effect for Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's the back-to-top link
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
                
                // Update focus for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({preventScroll: true});
                
                // Add URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Initialize AOS animations and custom animations
 */
function initializeAnimations() {
    // Initialize AOS library if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
            disable: 'mobile'
        });
    } else {
        // Fallback animation with Intersection Observer for browsers that support it
        if ('IntersectionObserver' in window) {
            // Selectors for elements to animate
            const elementsToAnimate = [
                '.timeline-item',
                '.skill-category',
                '.publication-card',
                '.stat-item',
                '.company-item'
            ];
            
            const elements = document.querySelectorAll(elementsToAnimate.join(', '));
            
            // Add initial styles
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });
            
            // Set up the observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.15 // Element is considered in view when 15% is visible
            });
            
            // Observe each element
            elements.forEach(el => {
                observer.observe(el);
            });
        } else {
            // For browsers that don't support Intersection Observer
            // Make all elements visible without animation
            const elementsToAnimate = document.querySelectorAll('.timeline-item, .skill-category, .publication-card, .stat-item, .company-item');
            elementsToAnimate.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }
    }
    
    // Typed.js integration for hero section (if available)
    const heroTitle = document.querySelector('.hero-text h1');
    if (typeof Typed !== 'undefined' && heroTitle) {
        new Typed(heroTitle, {
            strings: [
                'Financial happiness for every African entrepreneur',
                'Empowering African startups to scale globally',
                'Building Africa\'s future through venture capital'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 3000,
            startDelay: 1000,
            loop: true
        });
    }
}

/**
 * Contact form validation and submission
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Reset form status
            formStatus.textContent = '';
            formStatus.className = 'form-status';
            
            // Get form data
            const formData = new FormData(contactForm);
            const formEntries = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!validateForm(formEntries)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
            
            try {
                // Check if we're using Formspree or another service
                const formAction = contactForm.getAttribute('action');
                
                if (formAction && formAction.includes('formspree.io')) {
                    // Formspree submission
                    const response = await fetch(formAction, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        showFormSuccess();
                        contactForm.reset();
                    } else {
                        const error = await response.json();
                        showFormError(error.error || 'Something went wrong. Please try again.');
                    }
                } else {
                    // Mock submission for demo
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    showFormSuccess();
                    contactForm.reset();
                }
            } catch (error) {
                showFormError('Network error. Please check your connection and try again.');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
        
        // Add validation on input change
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
        });
    }
    
    // Validate the entire form
    function validateForm(data) {
        let isValid = true;
        
        // Validate name
        if (!data.name || data.name.trim() === '') {
            showFormError('Please enter your name');
            highlightInvalidField('name');
            isValid = false;
        }
        
        // Validate email
        if (!data.email || !isValidEmail(data.email)) {
            showFormError('Please enter a valid email address');
            highlightInvalidField('email');
            isValid = false;
        }
        
        // Validate subject
        if (!data.subject || data.subject.trim() === '') {
            showFormError('Please enter a subject');
            highlightInvalidField('subject');
            isValid = false;
        }
        
        // Validate message
        if (!data.message || data.message.trim() === '') {
            showFormError('Please enter your message');
            highlightInvalidField('message');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Validate a single input field
    function validateInput(input) {
        if (input.id === 'email' && input.value.trim() !== '') {
            if (!isValidEmail(input.value)) {
                input.classList.add('invalid');
                return false;
            } else {
                input.classList.remove('invalid');
                return true;
            }
        } else {
            if (input.value.trim() === '') {
                input.classList.add('invalid');
                return false;
            } else {
                input.classList.remove('invalid');
                return true;
            }
        }
    }
    
    // Highlight invalid form field
    function highlightInvalidField(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('invalid');
            field.focus();
        }
    }
    
    // Show form success message
    function showFormSuccess() {
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        formStatus.className = 'form-status success';
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            formStatus.style.opacity = '0';
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
                formStatus.style.opacity = '1';
            }, 500);
        }, 5000);
    }
    
    // Show form error message
    function showFormError(message) {
        formStatus.textContent = message;
        formStatus.className = 'form-status error';
    }
    
    // Validate email with regex
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Cookie consent banner functionality
 */
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptButton = document.getElementById('cookieAccept');
    const declineButton = document.getElementById('cookieDecline');
    
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('cookieConsent');
    
    if (cookieConsent && !consentGiven) {
        // Show the cookie banner with a slight delay
        setTimeout(() => {
            cookieConsent.style.display = 'block';
            // Add animation class
            setTimeout(() => {
                cookieConsent.classList.add('active');
            }, 10);
        }, 1500);
        
        // Handle accept
        if (acceptButton) {
            acceptButton.addEventListener('click', () => {
                acceptCookies();
            });
        }
        
        // Handle decline
        if (declineButton) {
            declineButton.addEventListener('click', () => {
                declineCookies();
            });
        }
    }
    
    function acceptCookies() {
        localStorage.setItem('cookieConsent', 'accepted');
        hideCookieBanner();
        
        // Here you would initialize any tracking scripts
        // For demo purposes, we're just logging to console
        console.log('Cookies accepted, tracking enabled');
    }
    
    function declineCookies() {
        localStorage.setItem('cookieConsent', 'declined');
        hideCookieBanner();
        
        // Disable any tracking scripts here
        console.log('Cookies declined, tracking disabled');
    }
    
    function hideCookieBanner() {
        cookieConsent.classList.remove('active');
        
        // After animation completes, hide the banner
        setTimeout(() => {
            cookieConsent.style.display = 'none';
        }, 300);
    }
}

/**
 * Back to top button functionality
 */
function initializeBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top a');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.parentElement.classList.add('visible');
            } else {
                backToTopButton.parentElement.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Add CSS styles
 */
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Form validation styles */
        input.invalid, textarea.invalid {
            border-color: var(--error) !important;
            box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1) !important;
        }
        
        /* Cookie consent animation */
        .cookie-consent {
            transform: translateY(100%) translateX(-50%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .cookie-consent.active {
            transform: translateY(0) translateX(-50%);
            opacity: 1;
        }
        
        /* Back to top button visibility */
        .back-to-top {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: none;
        }
        
        .back-to-top.visible {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
    `;
    document.head.appendChild(style);
}

// Call addStyles immediately
addStyles();