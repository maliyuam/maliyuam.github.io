/**
 * Muhammad Aliyu Portfolio - Deep Tech Innovation Theme
 * JavaScript for About Page
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeJourneyVisualization();
    initializeBioStatsAnimation();
});

/**
 * Initialize animations and interactions for the Journey Visualization section.
 */
function initializeJourneyVisualization() {
    const milestones = document.querySelectorAll('.milestone');

    if (milestones.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Animate milestones sequentially
                const trackMilestones = entry.target.querySelectorAll('.milestone');
                trackMilestones.forEach((milestone, index) => {
                    setTimeout(() => {
                        milestone.style.opacity = '1';
                        milestone.style.transform = 'translateX(0)';
                    }, index * 150);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.bridge-track').forEach(track => {
        observer.observe(track);
    });
}

/**
 * Animate the bio stats numbers when they become visible.
 */
function initializeBioStatsAnimation() {
    const bioStats = document.querySelectorAll('.bio-stat');

    if (bioStats.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValueElement = entry.target.querySelector('h5'); // Or a more specific selector
                if (statValueElement) {
                    animateStatNumber(statValueElement);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    bioStats.forEach(stat => {
        observer.observe(stat);
    });
}

/**
 * Animates a number from 0 to its target value.
 * @param {HTMLElement} element The element containing the number.
 */
function animateStatNumber(element) {
    const text = element.textContent;
    const endValue = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[0-9]/g, '');
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentValue = Math.round(endValue * (1 - Math.pow(1 - progress, 4))); // easeOutQuart

        element.textContent = currentValue + suffix;

        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = text; // Ensure it ends on the exact number
        }
    }, frameDuration);
}