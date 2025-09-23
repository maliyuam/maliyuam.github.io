// Advanced scroll reveal animations
export function initScrollReveal() {
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const animateElement = (element, animation) => {
        element.classList.add('animate__animated', `animate__${animation}`);
        element.style.opacity = '1';
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.animation || 'fadeInUp';
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    animateElement(element, animation);
                }, delay);

                if (element.dataset.once !== 'false') {
                    observer.unobserve(element);
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}