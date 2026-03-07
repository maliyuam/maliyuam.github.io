// main.js - Refactored for YC Redesign

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initCounters();
    initTestimonials();
});

/* ========================================
   NAVIGATION
   ======================================== */
function initNavigation() {
    const header = document.querySelector('.header');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const overlay = document.getElementById('nav-overlay');
    const links = document.querySelectorAll('.header__link, .header__cta');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.contains('is-open');
            toggle.classList.toggle('is-active', !isOpen);
            menu.classList.toggle('is-open', !isOpen);

            if (overlay) {
                overlay.classList.toggle('is-visible', !isOpen);
            }

            document.body.style.overflow = isOpen ? '' : 'hidden'; // Prevent scrolling when menu is open
        });
    }

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('is-open')) {
                toggle.classList.remove('is-active');
                menu.classList.remove('is-open');
                if (overlay) overlay.classList.remove('is-visible');
                document.body.style.overflow = '';
            }
        });
    });

    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', () => {
            toggle.classList.remove('is-active');
            menu.classList.remove('is-open');
            overlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        });
    }
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const options = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, options);

    // Elements to animate
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .stagger-children, .hero__photo');
    revealElements.forEach(el => observer.observe(el));
}

/* ========================================
   NUMBER COUNTERS
   ======================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter');

    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                if (isNaN(target)) return;

                // Animate
                const duration = 2000;
                const start = 0;
                const stepTime = Math.abs(Math.floor(duration / target));

                let current = start;
                const timer = setInterval(() => {
                    current += 1;
                    entry.target.textContent = current + (target > 10 ? '+' : '');
                    if (current >= target) {
                        clearInterval(timer);
                        entry.target.textContent = target + (target > 10 ? '+' : '');
                    }
                }, Math.max(stepTime, 20)); // Min 20ms step

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* ========================================
   TESTIMONIALS CAROUSEL
   ======================================== */
/* ========================================
   TESTIMONIALS CAROUSEL
   ======================================== */
function initTestimonials() {
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('testimonials-prev');
    const nextBtn = document.getElementById('testimonials-next');
    const dotsContainer = document.getElementById('testimonials-dots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const testimonials = track.querySelectorAll('.testimonial');
    const totalItems = testimonials.length;

    // Config
    let itemsPerView = window.innerWidth <= 768 ? 1 : 2;
    let totalSlides = Math.ceil(totalItems / itemsPerView);
    let currentSlide = 0;
    let autoPlayInterval;

    // Initialize Layout
    function setupLayout() {
        // Track width: e.g. 3 pages = 300%
        track.style.display = 'flex';
        track.style.width = `${totalSlides * 100}%`;
        track.style.transition = 'transform 0.5s cubic-bezier(0.2, 0, 0.2, 1)';

        // Item width: e.g. 6 items in 300% track => 1/6 of track = 16.66%
        // 16.66% of 300% = 50% of viewport. Correct.
        const itemWidth = 100 / totalItems;

        testimonials.forEach(t => {
            t.style.width = `${itemWidth}%`;
            t.style.flex = `0 0 ${itemWidth}%`;
            t.style.boxSizing = 'border-box';
            // Add padding to separate cards (simulating gap)
            t.style.paddingRight = '24px';
        });
    }

    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonials-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Update UI
    function updateSlide() {
        const dots = dotsContainer.querySelectorAll('.testimonials-dot');

        // Translate percentage: page 1 = 1/totalSlides * 100
        const translatePct = (currentSlide * 100) / totalSlides;
        track.style.transform = `translateX(-${translatePct}%)`;

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide >= totalSlides - 1;
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentSlide >= totalSlides - 1 ? '0.5' : '1';
    }

    function goToSlide(index) {
        currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
        updateSlide();
        resetAutoPlay();
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateSlide();
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1; // Loop back
        }
        updateSlide();
    }

    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 6000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Event listeners
    prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
    nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            itemsPerView = window.innerWidth <= 768 ? 1 : 2;
            const newTotalSlides = Math.ceil(totalItems / itemsPerView);

            if (newTotalSlides !== totalSlides) {
                totalSlides = newTotalSlides;
                currentSlide = 0; // Reset to start to avoid index issues
                setupLayout();
                createDots();
                updateSlide();
            }
        }, 200);
    });

    // Initialize
    setupLayout();
    createDots();
    updateSlide();
    startAutoPlay();
}