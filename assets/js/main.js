/**
 * Muhammad Aliyu Portfolio - Deep Tech Innovation Theme
 * Main JavaScript file
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializePortfolioInteractions();
    initializeContactForm();
    initializeCookieConsent();
    initializeBackToTop();
    initializeTypingEffect();
    initializeSkillsInteraction();
    initializeBridgeVisualization();
    initializeFooter();
});

/**
 * Sets the current year in the footer.
 */
function initializeFooter() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Bridge Visualization Interactive Features
 */
function initializeBridgeVisualization() {
    const bridgeTracks = document.querySelectorAll('.bridge-track');
    const convergencePoint = document.querySelector('.convergence-point');

    if (bridgeTracks.length === 0) return;

    // Add hover effects that connect tracks to convergence point
    bridgeTracks.forEach((track, index) => {
        track.addEventListener('mouseenter', function() {
            // Highlight the track
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.zIndex = '10';

            // Create connection line effect
            createConnectionLine(this, convergencePoint);

            // Highlight related milestones
            const milestones = this.querySelectorAll('.milestone');
            milestones.forEach(milestone => {
                milestone.classList.add('highlighted');
            });
        });

        track.addEventListener('mouseleave', function() {
            // Reset track
            this.style.transform = '';
            this.style.zIndex = '';

            // Remove connection line
            removeConnectionLine();

            // Remove milestone highlights
            const milestones = this.querySelectorAll('.milestone');
            milestones.forEach(milestone => {
                milestone.classList.remove('highlighted');
            });
        });

        // Animate impact numbers on scroll
        const impactNumber = track.querySelector('.impact-number');
        if (impactNumber) {
            observeAndAnimateNumber(impactNumber);
        }
    });

    // Add parallax effect to convergence point
    if (convergencePoint) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.05;
            convergencePoint.style.transform = `translateY(${rate}px)`;
        });
    }
}

/**
 * Create visual connection line between track and convergence
 */
function createConnectionLine(track, convergence) {
    // This is a visual effect placeholder - in production,
    // you might use SVG or Canvas for actual line drawing
    track.classList.add('connected');
    if (convergence) {
        convergence.classList.add('receiving-connection');
    }
}

/**
 * Remove connection line effect
 */
function removeConnectionLine() {
    document.querySelectorAll('.connected').forEach(el => {
        el.classList.remove('connected');
    });
    document.querySelectorAll('.receiving-connection').forEach(el => {
        el.classList.remove('receiving-connection');
    });
}

/**
 * Observe and animate numbers when they come into view
 */
function observeAndAnimateNumber(element) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !element.hasAttribute('data-animated')) {
                animateValue(element);
                element.setAttribute('data-animated', 'true');
            }
        });
    }, { threshold: 0.5 });

    observer.observe(element);
}

/**
 * Navigation functionality with enhanced mobile experience
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
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = '';
            }
        });

        // Add keyboard support for toggle button
        navToggle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navToggle.click();
            }
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';

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
            document.body.style.overflow = '';

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
            document.body.style.overflow = '';

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
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    // Throttle scroll events for performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
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
                    top: targetPosition - headerHeight - 20,
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

    // Active section highlighting in navigation
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-menu a[href^="#"]');

    function highlightActiveSection() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);
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
            disable: window.innerWidth < 768 ? true : false
        });
    }

    // Custom intersection observer for additional animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Special animation for stats
                if (entry.target.classList.contains('stat-number')) {
                    animateValue(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.timeline-item, .skill-category, .portfolio-item').forEach(el => {
        animateOnScroll.observe(el);
    });
}

/**
 * Animate numerical values
 */
function animateValue(element) {
    const endValue = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    // Check for special characters to preserve (+ or %)
    const hasPlus = element.textContent.includes('+');
    const hasPercent = element.textContent.includes('%');

    const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentValue = Math.round(endValue * easeOutQuart(progress));

        // Preserve the special characters in the output
        if (hasPlus) {
            element.textContent = currentValue + '+';
        } else if (hasPercent) {
            element.textContent = currentValue + '%';
        } else {
            element.textContent = currentValue;
        }

        if (frame === totalFrames) {
            clearInterval(counter);
        }
    }, frameDuration);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

/**
 * Portfolio section interactions
 */
function initializePortfolioInteractions() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        // Add hover effect for touch devices
        item.addEventListener('touchstart', function() {
            this.classList.add('touch-hover');
        });

        item.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-hover');
            }, 500);
        });

        // Click to expand functionality (optional)
        const links = item.querySelectorAll('.portfolio-link');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    });
}

/**
 * Skills section interactive hover effects
 */
function initializeSkillsInteraction() {
    const skillCategories = document.querySelectorAll('.skill-category');

    skillCategories.forEach(category => {
        const icon = category.querySelector('.skill-icon');

        category.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1) rotate(-5deg)';
        });

        category.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

/**
 * Hero section typing effect
 */
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-text h1 span');
    if (!heroTitle) return;

    const phrases = [
        'Innovation Future',
        'Tech Ecosystem',
        'Digital Transformation'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            heroTitle.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            heroTitle.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before new phrase
        } else {
            typingSpeed = isDeleting ? 50 : 100;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing effect after a delay
    setTimeout(typeEffect, 1000);
}

/**
 * Contact form validation and submission
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Reset form status
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                showFormError('Please correct the errors in the form.');
                return;
            }

            // Get form data
            const formData = new FormData(contactForm);

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';

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
                        inputs.forEach(input => input.classList.remove('valid'));
                    } else {
                        const error = await response.json();
                        showFormError(error.error || 'Something went wrong. Please try again.');
                    }
                } else {
                    // Mock submission for demo
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    showFormSuccess();
                    contactForm.reset();
                    inputs.forEach(input => input.classList.remove('valid'));
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
    }

    // Field validation
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;

        // Remove previous error states
        field.classList.remove('error', 'valid');

        if (value === '') {
            field.classList.add('error');
            isValid = false;
        } else {
            switch (fieldName) {
                case 'email':
                    if (!isValidEmail(value)) {
                        field.classList.add('error');
                        isValid = false;
                    } else {
                        field.classList.add('valid');
                    }
                    break;
                case 'name':
                    if (value.length < 2) {
                        field.classList.add('error');
                        isValid = false;
                    } else {
                        field.classList.add('valid');
                    }
                    break;
                default:
                    field.classList.add('valid');
            }
        }

        return isValid;
    }

    // Show form success message
    function showFormSuccess() {
        formStatus.textContent = 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        }, 2000);

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

        // Initialize analytics if needed
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }

    function declineCookies() {
        localStorage.setItem('cookieConsent', 'declined');
        hideCookieBanner();

        // Disable analytics if needed
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
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
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        // Show/hide button based on scroll position
        let isVisible = false;

        window.addEventListener('scroll', () => {
            const shouldShow = window.scrollY > 300;

            if (shouldShow && !isVisible) {
                backToTopButton.classList.add('visible');
                isVisible = true;
            } else if (!shouldShow && isVisible) {
                backToTopButton.classList.remove('visible');
                isVisible = false;
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
 * Add dynamic styles
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Form validation styles */
        input.error, textarea.error {
            border-color: var(--error) !important;
            animation: shake 0.5s ease-in-out;
        }

        input.valid, textarea.valid {
            border-color: var(--success) !important;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }

        /* Loading spinner */
        .loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: var(--white);
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
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

        /* Navigation active state */
        .nav-menu a.active {
            color: var(--accent-light);
        }

        .nav-menu a.active::after {
            width: 100%;
        }

        /* Touch hover state for portfolio items */
        .portfolio-item.touch-hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-xl);
        }

        /* Animated elements */
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        /* Smooth transitions for all interactive elements */
        .portfolio-item,
        .skill-category,
        .timeline-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        /* Bridge visualization effects */
        .bridge-track {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .bridge-track.connected {
            box-shadow: 0 0 30px rgba(62, 146, 204, 0.3);
        }

        .bridge-track.connected::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -20px;
            width: 40px;
            height: 2px;
            background: linear-gradient(90deg, var(--track-color) 0%, transparent 100%);
            animation: pulse-line 1.5s ease-in-out infinite;
        }

        @keyframes pulse-line {
            0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
            50% { opacity: 1; transform: scaleX(1); }
        }

        .convergence-point.receiving-connection .convergence-core {
            animation: pulse-glow 1.5s ease-in-out infinite;
        }

        @keyframes pulse-glow {
            0%, 100% { box-shadow: var(--shadow-xl); }
            50% { box-shadow: 0 0 40px rgba(62, 146, 204, 0.5); }
        }

        .milestone.highlighted {
            transform: translateX(5px);
            background-color: rgba(62, 146, 204, 0.05);
            margin-left: -10px;
            padding-left: calc(var(--spacing-md) + 10px);
            border-radius: var(--border-radius-sm);
        }

        /* CSS Variables for track colors */
        .research-track {
            --track-color: 62, 146, 204;
        }

        .entrepreneurship-track {
            --track-color: 0, 168, 232;
        }

        .leadership-track {
            --track-color: 0, 126, 167;
        }

        .teaching-track {
            --track-color: 0, 52, 89;
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// Utility function to debounce events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});
