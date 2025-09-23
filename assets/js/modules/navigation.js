// Navigation functionality
export function initNavigation() {
    const nav = document.getElementById('navigation');
    const navToggle = nav.querySelector('.nav-toggle');
    const navMenu = nav.querySelector('.nav-menu');
    let lastScrollY = window.scrollY;

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Hide/show navigation on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });

    // Active link highlighting
    const navLinks = nav.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}